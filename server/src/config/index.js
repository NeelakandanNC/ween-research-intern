import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
dotenv.config({ path: path.resolve(__dirname, '../../', envFile) })

const config = {
    // Environment
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
    isProd: process.env.NODE_ENV === 'production',

    // Server
    server: {
        port: parseInt(process.env.PORT, 10) || 3001,
        host: process.env.HOST || '0.0.0.0',
    },

    // Database
    database: {
        url: process.env.DATABASE_URL,
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    // CORS
    cors: {
        origins: process.env.CORS_ORIGINS?.split(',') || [
            'http://localhost:5173',
            'http://localhost:3000'
        ],
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
}

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key])

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`)
}

export default config
