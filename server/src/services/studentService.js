import { prisma } from '../config/database.js'
import { NotFoundError, ForbiddenError } from '../errors/index.js'
import { SUCCESS_MESSAGES } from '../constants/index.js'

class StudentService {
    async getById(id) {
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true, role: true } }
            }
        })

        if (!student) {
            throw new NotFoundError('Student not found')
        }

        return { student }
    }

    async updateProfile(userId, data) {
        const student = await prisma.student.update({
            where: { userId },
            data,
            include: {
                user: { select: { id: true, email: true, name: true, role: true } }
            }
        })

        return {
            message: SUCCESS_MESSAGES.PROFILE_UPDATED,
            student
        }
    }

    // CV Upload - stores base64 encoded PDF
    async uploadCV(userId, file) {
        if (!file) {
            throw new NotFoundError('No file uploaded')
        }

        const cvData = file.buffer.toString('base64')
        const cvFileName = file.originalname

        const student = await prisma.student.update({
            where: { userId },
            data: {
                cvData,
                cvFileName,
                cvUploadedAt: new Date()
            },
            select: {
                id: true,
                cvFileName: true,
                cvUploadedAt: true
            }
        })

        return {
            message: 'CV uploaded successfully',
            cv: {
                fileName: student.cvFileName,
                uploadedAt: student.cvUploadedAt
            }
        }
    }

    // Get CV data for a student (for professors viewing applications)
    async getCV(studentId, requestingUserId) {
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: {
                cvData: true,
                cvFileName: true,
                cvUploadedAt: true,
                userId: true
            }
        })

        if (!student) {
            throw new NotFoundError('Student not found')
        }

        if (!student.cvData) {
            throw new NotFoundError('No CV uploaded')
        }

        // Check if requester is the student themselves or a professor
        const requester = await prisma.user.findUnique({
            where: { id: requestingUserId },
            select: { role: true }
        })

        if (student.userId !== requestingUserId && requester?.role !== 'professor') {
            throw new ForbiddenError('Not authorized to view this CV')
        }

        return {
            cvData: student.cvData,
            fileName: student.cvFileName,
            uploadedAt: student.cvUploadedAt
        }
    }

    // Delete CV
    async deleteCV(userId) {
        const student = await prisma.student.update({
            where: { userId },
            data: {
                cvData: null,
                cvFileName: null,
                cvUploadedAt: null
            }
        })

        return { message: 'CV deleted successfully' }
    }

    // Get CV status (without the actual data)
    async getCVStatus(userId) {
        const student = await prisma.student.findUnique({
            where: { userId },
            select: {
                cvFileName: true,
                cvUploadedAt: true
            }
        })

        if (!student) {
            throw new NotFoundError('Student not found')
        }

        return {
            hasCV: !!student.cvFileName,
            fileName: student.cvFileName,
            uploadedAt: student.cvUploadedAt
        }
    }
}

export default new StudentService()
