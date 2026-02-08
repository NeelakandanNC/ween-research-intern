import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js'

// Base API Error class
export class ApiError extends Error {
    constructor(statusCode, message, errors = null) {
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

// Specific error classes
export class BadRequestError extends ApiError {
    constructor(message = ERROR_MESSAGES.VALIDATION_ERROR, errors = null) {
        super(HTTP_STATUS.BAD_REQUEST, message, errors)
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = ERROR_MESSAGES.UNAUTHORIZED) {
        super(HTTP_STATUS.UNAUTHORIZED, message)
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = ERROR_MESSAGES.FORBIDDEN) {
        super(HTTP_STATUS.FORBIDDEN, message)
    }
}

export class NotFoundError extends ApiError {
    constructor(message = ERROR_MESSAGES.NOT_FOUND) {
        super(HTTP_STATUS.NOT_FOUND, message)
    }
}

export class ConflictError extends ApiError {
    constructor(message = ERROR_MESSAGES.EMAIL_EXISTS) {
        super(HTTP_STATUS.CONFLICT, message)
    }
}

export class RateLimitError extends ApiError {
    constructor(message = ERROR_MESSAGES.RATE_LIMIT) {
        super(HTTP_STATUS.TOO_MANY_REQUESTS, message)
    }
}

export class InternalError extends ApiError {
    constructor(message = ERROR_MESSAGES.INTERNAL_ERROR) {
        super(HTTP_STATUS.INTERNAL_SERVER_ERROR, message)
    }
}
