import { prisma } from '../config/database.js'
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../errors/index.js'
import { SUCCESS_MESSAGES, INTERNSHIP_STATUS } from '../constants/index.js'

class ApplicationService {
    async getMyApplications(userId) {
        const student = await this.getStudentByUserId(userId)

        const applications = await prisma.application.findMany({
            where: { studentId: student.id },
            include: {
                internship: {
                    include: {
                        professor: {
                            include: {
                                user: { select: { name: true, email: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { appliedAt: 'desc' }
        })

        return { applications }
    }

    async apply(userId, internshipId) {
        const student = await this.getStudentByUserId(userId)

        // Verify internship exists and is active
        const internship = await prisma.internship.findUnique({
            where: { id: internshipId }
        })

        if (!internship) {
            throw new NotFoundError('Internship not found')
        }

        if (internship.status !== INTERNSHIP_STATUS.ACTIVE) {
            throw new BadRequestError('Internship is no longer accepting applications')
        }

        // Check for existing application
        const existingApplication = await prisma.application.findUnique({
            where: {
                internshipId_studentId: {
                    internshipId,
                    studentId: student.id
                }
            }
        })

        if (existingApplication) {
            throw new ConflictError('Already applied to this internship')
        }

        const application = await prisma.application.create({
            data: {
                internshipId,
                studentId: student.id
            },
            include: {
                internship: {
                    include: {
                        professor: {
                            include: {
                                user: { select: { name: true } }
                            }
                        }
                    }
                }
            }
        })

        return {
            message: SUCCESS_MESSAGES.APPLICATION_SUBMITTED,
            application
        }
    }

    async updateStatus(applicationId, userId, { status, professorNotes }) {
        // Verify professor owns the internship
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                internship: {
                    include: { professor: true }
                }
            }
        })

        if (!application) {
            throw new NotFoundError('Application not found')
        }

        if (application.internship.professor.userId !== userId) {
            throw new ForbiddenError('Not authorized to update this application')
        }

        const updated = await prisma.application.update({
            where: { id: applicationId },
            data: {
                status,
                professorNotes,
                respondedAt: new Date()
            },
            include: {
                student: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        })

        return {
            message: SUCCESS_MESSAGES.APPLICATION_UPDATED,
            application: updated
        }
    }

    async getStudentByUserId(userId) {
        const student = await prisma.student.findUnique({
            where: { userId }
        })

        if (!student) {
            throw new NotFoundError('Student profile not found')
        }

        return student
    }
}

export default new ApplicationService()
