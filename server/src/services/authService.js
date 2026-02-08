import bcrypt from 'bcrypt'
import { prisma } from '../config/database.js'
import { generateToken } from '../utils/jwt.js'
import { ConflictError, UnauthorizedError, NotFoundError } from '../errors/index.js'
import { ROLES, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/index.js'

class AuthService {
    async signup({ email, password, name, role, ...roleData }) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            throw new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user with role-specific profile in transaction
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    name,
                    role
                }
            })

            if (role === ROLES.PROFESSOR) {
                await tx.professor.create({
                    data: {
                        userId: newUser.id,
                        department: roleData.department || '',
                        researchAreas: roleData.researchAreas || [],
                        bio: roleData.bio || ''
                    }
                })
            } else {
                await tx.student.create({
                    data: {
                        userId: newUser.id,
                        major: roleData.major || '',
                        year: roleData.year || 'Freshman',
                        gpa: roleData.gpa || null,
                        skills: roleData.skills || [],
                        experience: roleData.experience || '',
                        interests: roleData.interests || []
                    }
                })
            }

            return newUser
        })

        // Get full user with profile
        const fullUser = await this.getUserWithProfile(user.id)
        const token = generateToken(fullUser)

        return {
            message: SUCCESS_MESSAGES.USER_CREATED,
            user: this.sanitizeUser(fullUser),
            token
        }
    }

    async login({ email, password }) {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: { professor: true, student: true }
        })

        if (!user) {
            throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS)
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS)
        }

        const token = generateToken(user)

        return {
            message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
            user: this.sanitizeUser(user),
            token
        }
    }

    async getMe(userId) {
        const user = await this.getUserWithProfile(userId)
        if (!user) {
            throw new NotFoundError('User not found')
        }
        return { user: this.sanitizeUser(user) }
    }

    async updateProfile(userId, data) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { name: data.name },
            include: { professor: true, student: true }
        })

        return {
            message: SUCCESS_MESSAGES.PROFILE_UPDATED,
            user: this.sanitizeUser(user)
        }
    }

    async getUserWithProfile(userId) {
        return prisma.user.findUnique({
            where: { id: userId },
            include: { professor: true, student: true }
        })
    }

    sanitizeUser(user) {
        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}

export default new AuthService()
