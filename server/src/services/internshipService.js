import { prisma } from '../config/database.js'
import { NotFoundError, ForbiddenError, BadRequestError } from '../errors/index.js'
import { SUCCESS_MESSAGES, INTERNSHIP_STATUS } from '../constants/index.js'

class InternshipService {
    async getAll({ status, researchArea, professorId, page = 1, limit = 20 }) {
        // Enforce pagination limits
        const take = Math.min(Math.max(1, parseInt(limit) || 20), 100)
        const skip = (Math.max(1, parseInt(page) || 1) - 1) * take

        const where = {}
        if (status) where.status = status
        if (researchArea) where.researchArea = researchArea
        if (professorId) where.professorId = professorId

        const [internships, total] = await Promise.all([
            prisma.internship.findMany({
                where,
                include: {
                    professor: {
                        include: {
                            user: { select: { name: true, email: true } }
                        }
                    },
                    _count: { select: { applications: true } }
                },
                orderBy: { createdAt: 'desc' },
                take,
                skip
            }),
            prisma.internship.count({ where })
        ])

        return {
            internships,
            pagination: {
                page: Math.max(1, parseInt(page) || 1),
                limit: take,
                total,
                totalPages: Math.ceil(total / take)
            }
        }
    }

    async getById(id) {
        const internship = await prisma.internship.findUnique({
            where: { id },
            include: {
                professor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                },
                _count: { select: { applications: true } }
            }
        })

        if (!internship) {
            throw new NotFoundError('Internship not found')
        }

        return { internship }
    }

    async getMyInternships(userId) {
        const professor = await this.getProfessorByUserId(userId)

        const internships = await prisma.internship.findMany({
            where: { professorId: professor.id },
            include: {
                _count: { select: { applications: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return { internships }
    }

    async create(userId, data) {
        const professor = await this.getProfessorByUserId(userId)

        const internship = await prisma.internship.create({
            data: {
                ...data,
                professorId: professor.id
            },
            include: {
                professor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        })

        return {
            message: SUCCESS_MESSAGES.INTERNSHIP_CREATED,
            internship
        }
    }

    async update(id, userId, data) {
        await this.verifyOwnership(id, userId)

        const internship = await prisma.internship.update({
            where: { id },
            data,
            include: {
                professor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        })

        return {
            message: SUCCESS_MESSAGES.INTERNSHIP_UPDATED,
            internship
        }
    }

    async delete(id, userId) {
        await this.verifyOwnership(id, userId)

        await prisma.internship.delete({ where: { id } })

        return { message: SUCCESS_MESSAGES.INTERNSHIP_DELETED }
    }

    async getApplicants(id, userId) {
        await this.verifyOwnership(id, userId)

        const applications = await prisma.application.findMany({
            where: { internshipId: id },
            include: {
                student: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        })

        return { applications }
    }

    // Helper methods
    async getProfessorByUserId(userId) {
        const professor = await prisma.professor.findUnique({
            where: { userId }
        })

        if (!professor) {
            throw new NotFoundError('Professor profile not found')
        }

        return professor
    }

    async verifyOwnership(internshipId, userId) {
        const internship = await prisma.internship.findUnique({
            where: { id: internshipId },
            include: { professor: true }
        })

        if (!internship) {
            throw new NotFoundError('Internship not found')
        }

        if (internship.professor.userId !== userId) {
            throw new ForbiddenError('Not authorized to modify this internship')
        }

        return internship
    }
}

export default new InternshipService()
