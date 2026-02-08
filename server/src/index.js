import express from 'express'
import cors from 'cors'
import config from './config/index.js'
import database from './config/database.js'
import { errorHandler, requestLogger, rateLimiter, securityHeaders, csrfProtection, sanitizeInput, preventParamPollution } from './middleware/index.js'

// Import routes
import authRoutes from './routes/auth.js'
import professorRoutes from './routes/professors.js'
import studentRoutes from './routes/students.js'
import internshipRoutes from './routes/internships.js'
import applicationRoutes from './routes/applications.js'
import bookmarkRoutes from './routes/bookmarks.js'

class Server {
    constructor() {
        this.app = express()
        this.setupMiddleware()
        this.setupRoutes()
        this.setupErrorHandling()
    }

    setupMiddleware() {
        // Security headers (helmet.js)
        this.app.use(securityHeaders)

        // CORS
        this.app.use(cors({
            origin: config.cors.origins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }))

        // Body parsing
        this.app.use(express.json({ limit: '10kb' }))
        this.app.use(express.urlencoded({ extended: true }))

        // Input sanitization & CSRF protection
        this.app.use(sanitizeInput)
        this.app.use(preventParamPollution)
        this.app.use(csrfProtection)

        // Logging & rate limiting
        this.app.use(requestLogger)
        this.app.use(rateLimiter)

        // Request timeout (30 seconds)
        this.app.use((req, res, next) => {
            req.setTimeout(30000, () => {
                res.status(408).json({
                    success: false,
                    error: 'Request timeout'
                })
            })
            next()
        })

        // Trust proxy for rate limiting behind reverse proxy
        if (config.isProd) {
            this.app.set('trust proxy', 1)
        }
    }

    setupRoutes() {
        // Health check (no auth required)
        this.app.get('/api/health', async (req, res) => {
            const dbHealth = await database.healthCheck()
            res.json({
                success: true,
                status: 'ok',
                service: 'Research Intern API',
                environment: config.env,
                database: dbHealth,
                timestamp: new Date().toISOString()
            })
        })

        // API routes
        this.app.use('/api/auth', authRoutes)
        this.app.use('/api/professors', professorRoutes)
        this.app.use('/api/students', studentRoutes)
        this.app.use('/api/internships', internshipRoutes)
        this.app.use('/api/applications', applicationRoutes)
        this.app.use('/api/bookmarks', bookmarkRoutes)

        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: `Endpoint ${req.method} ${req.originalUrl} not found`
            })
        })
    }

    setupErrorHandling() {
        this.app.use(errorHandler)

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error)
            process.exit(1)
        })

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason) => {
            console.error('❌ Unhandled Rejection:', reason)
            process.exit(1)
        })

        // Graceful shutdown
        process.on('SIGTERM', () => this.shutdown('SIGTERM'))
        process.on('SIGINT', () => this.shutdown('SIGINT'))
    }

    async shutdown(signal) {
        console.log(`\n📤 ${signal} received. Shutting down gracefully...`)
        await database.disconnect()
        process.exit(0)
    }

    async start() {
        try {
            // Connect to database
            await database.connect()

            // Start server
            this.app.listen(config.server.port, config.server.host, () => {
                console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🎓 Research Intern API Server                           ║
║   ─────────────────────────────────────────────────────   ║
║   Environment: ${config.env.padEnd(12)}                           ║
║   Server:      http://${config.server.host}:${config.server.port}                   ║
║   Health:      http://localhost:${config.server.port}/api/health       ║
╚═══════════════════════════════════════════════════════════╝
                `)
            })
        } catch (error) {
            console.error('❌ Failed to start server:', error)
            process.exit(1)
        }
    }
}

// Start the server
const server = new Server()
server.start()
