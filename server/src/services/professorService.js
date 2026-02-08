import { prisma } from '../config/database.js'
import { NotFoundError } from '../errors/index.js'
import { SUCCESS_MESSAGES } from '../constants/index.js'

class ProfessorService {
    async getAll() {
        const professors = await prisma.professor.findMany({
            include: {
                user: { select: { id: true, email: true, name: true, role: true } }
            }
        })
        return { professors }
    }

    async getById(id) {
        const professor = await prisma.professor.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true, role: true } },
                internships: { where: { status: 'active' } }
            }
        })

        if (!professor) {
            throw new NotFoundError('Professor not found')
        }

        return { professor }
    }

    async updateProfile(userId, data) {
        const professor = await prisma.professor.update({
            where: { userId },
            data,
            include: {
                user: { select: { id: true, email: true, name: true, role: true } }
            }
        })

        return {
            message: SUCCESS_MESSAGES.PROFILE_UPDATED,
            professor
        }
    }
}

export default new ProfessorService()
