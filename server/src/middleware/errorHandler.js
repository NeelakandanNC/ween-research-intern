import config from '../config/index.js'
import { ApiError } from '../errors/index.js'
import { HTTP_STATUS } from '../constants/index.js'

export const errorHandler = (err, req, res, next) => {
    // Log error
    if (config.isDev) {
        console.error('❌ Error:', err)
    } else {
        console.error('❌ Error:', err.message)
    }

    // Handle known API errors
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            ...(err.errors && { details: err.errors }),
            ...(config.isDev && { stack: err.stack })
        })
    }

    // Handle Prisma errors
    if (err.code === 'P2002') {
        return res.status(HTTP_STATUS.CONFLICT).json({
            success: false,
            error: 'A record with this value already exists'
        })
    }

    if (err.code === 'P2025') {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            error: 'Record not found'
        })
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: 'Invalid token'
        })
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
            success: false,
            error: 'Token expired'
        })
    }

    // Handle validation errors
    if (err.name === 'ZodError') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Validation failed',
            details: err.errors
        })
    }

    // Default server error
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: config.isDev ? err.message : 'Internal server error',
        ...(config.isDev && { stack: err.stack })
    })
}

// Async handler wrapper to catch errors
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}
