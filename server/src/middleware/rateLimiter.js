import config from '../config/index.js'

// Simple in-memory rate limiter (use Redis in production clustering)
const requestCounts = new Map()

export const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()
    const windowStart = now - config.rateLimit.windowMs

    // Clean old entries
    if (requestCounts.has(ip)) {
        const requests = requestCounts.get(ip).filter(time => time > windowStart)
        requestCounts.set(ip, requests)

        if (requests.length >= config.rateLimit.max) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests, please try again later',
                retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
            })
        }

        requests.push(now)
    } else {
        requestCounts.set(ip, [now])
    }

    next()
}

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now()
    const windowStart = now - config.rateLimit.windowMs

    for (const [ip, requests] of requestCounts.entries()) {
        const validRequests = requests.filter(time => time > windowStart)
        if (validRequests.length === 0) {
            requestCounts.delete(ip)
        } else {
            requestCounts.set(ip, validRequests)
        }
    }
}, 60000) // Cleanup every minute
