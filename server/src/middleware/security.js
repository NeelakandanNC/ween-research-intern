import helmet from 'helmet'

// Security headers middleware using helmet.js
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
})

// CSRF protection for state-changing requests
export const csrfProtection = (req, res, next) => {
    // Skip for safe methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next()
    }

    // Check Origin header matches allowed origins
    const origin = req.get('Origin')
    const host = req.get('Host')

    if (origin) {
        const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173']
        if (!allowedOrigins.some(allowed => origin.startsWith(allowed.trim()))) {
            return res.status(403).json({
                success: false,
                error: 'CSRF validation failed'
            })
        }
    }

    next()
}

// Input sanitization - strip null bytes and trim strings
export const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.replace(/\0/g, '').trim()
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize)
        }
        if (obj && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj).map(([k, v]) => [k, sanitize(v)])
            )
        }
        return obj
    }

    if (req.body) req.body = sanitize(req.body)
    if (req.query) req.query = sanitize(req.query)
    if (req.params) req.params = sanitize(req.params)

    next()
}

// Prevent parameter pollution
export const preventParamPollution = (req, res, next) => {
    // Convert arrays in query params to last value (prevent pollution)
    for (const key in req.query) {
        if (Array.isArray(req.query[key])) {
            req.query[key] = req.query[key][req.query[key].length - 1]
        }
    }
    next()
}
