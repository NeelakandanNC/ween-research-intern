import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import { prisma } from '../config/database.js'
import { UnauthorizedError, ForbiddenError } from '../errors/index.js'
import { ROLES } from '../constants/index.js'

// Verify JWT token
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedError('No token provided')
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, config.jwt.secret)

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { professor: true, student: true }
        })

        if (!user) {
            throw new UnauthorizedError('User not found')
        }

        req.user = user
        next()
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            next(error)
        } else {
            next(new UnauthorizedError('Invalid token'))
        }
    }
}

// Role check middleware
export const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`))
    }
    next()
}

// Shorthand role checks
export const isProfessor = requireRole(ROLES.PROFESSOR)
export const isStudent = requireRole(ROLES.STUDENT)
