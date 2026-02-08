// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
}

// User Roles
export const ROLES = {
    PROFESSOR: 'professor',
    STUDENT: 'student',
}

// Application Status
export const APPLICATION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
}

// Internship Status
export const INTERNSHIP_STATUS = {
    ACTIVE: 'active',
    CLOSED: 'closed',
}

// Student Years
export const STUDENT_YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior']

// Error Messages
export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'You do not have permission to perform this action',
    NOT_FOUND: 'Resource not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Something went wrong',
    RATE_LIMIT: 'Too many requests, please try again later',
}

// Success Messages
export const SUCCESS_MESSAGES = {
    USER_CREATED: 'User created successfully',
    LOGIN_SUCCESS: 'Login successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    INTERNSHIP_CREATED: 'Internship created successfully',
    INTERNSHIP_UPDATED: 'Internship updated successfully',
    INTERNSHIP_DELETED: 'Internship deleted successfully',
    APPLICATION_SUBMITTED: 'Application submitted successfully',
    APPLICATION_UPDATED: 'Application status updated',
    BOOKMARK_ADDED: 'Bookmark added',
    BOOKMARK_REMOVED: 'Bookmark removed',
}
