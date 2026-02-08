import { prisma } from '../config/database.js'
import { NotFoundError, ConflictError } from '../errors/index.js'
import { SUCCESS_MESSAGES } from '../constants/index.js'

class BookmarkService {
    async getMyBookmarks(userId) {
        const student = await this.getStudentByUserId(userId)

        const bookmarks = await prisma.bookmark.findMany({
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
            orderBy: { createdAt: 'desc' }
        })

        return { bookmarks }
    }

    async add(userId, internshipId) {
        const student = await this.getStudentByUserId(userId)

        // Verify internship exists
        const internship = await prisma.internship.findUnique({
            where: { id: internshipId }
        })

        if (!internship) {
            throw new NotFoundError('Internship not found')
        }

        // Check for existing bookmark
        const existing = await prisma.bookmark.findUnique({
            where: {
                studentId_internshipId: {
                    studentId: student.id,
                    internshipId
                }
            }
        })

        if (existing) {
            throw new ConflictError('Already bookmarked')
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                studentId: student.id,
                internshipId
            },
            include: { internship: true }
        })

        return {
            message: SUCCESS_MESSAGES.BOOKMARK_ADDED,
            bookmark
        }
    }

    async remove(userId, internshipId) {
        const student = await this.getStudentByUserId(userId)

        await prisma.bookmark.delete({
            where: {
                studentId_internshipId: {
                    studentId: student.id,
                    internshipId
                }
            }
        })

        return { message: SUCCESS_MESSAGES.BOOKMARK_REMOVED }
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

export default new BookmarkService()
