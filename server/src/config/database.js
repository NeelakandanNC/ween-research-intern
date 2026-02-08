import { PrismaClient } from '@prisma/client'
import config from './index.js'

class Database {
    constructor() {
        this.prisma = null
        this.isConnected = false
    }

    getInstance() {
        if (!this.prisma) {
            this.prisma = new PrismaClient({
                log: config.isDev ? ['query', 'error', 'warn'] : ['error'],
                errorFormat: config.isDev ? 'pretty' : 'minimal',
            })
        }
        return this.prisma
    }

    async connect(maxRetries = 5) {
        const prisma = this.getInstance()

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 Attempting database connection (attempt ${attempt}/${maxRetries})...`)
                await prisma.$connect()
                this.isConnected = true
                console.log('✅ Database connected successfully')
                return true
            } catch (error) {
                console.error(`❌ Connection attempt ${attempt} failed:`, error.message)
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
                    console.log(`⏳ Retrying in ${delay / 1000}s...`)
                    await new Promise(resolve => setTimeout(resolve, delay))
                } else {
                    throw error
                }
            }
        }
    }

    async disconnect() {
        if (this.prisma) {
            await this.prisma.$disconnect()
            this.isConnected = false
            console.log('📤 Database disconnected')
        }
    }

    async healthCheck() {
        try {
            await this.prisma.$queryRaw`SELECT 1`
            return { status: 'healthy', connected: true }
        } catch (error) {
            return { status: 'unhealthy', connected: false, error: error.message }
        }
    }
}

// Singleton instance
const database = new Database()
export const prisma = database.getInstance()
export default database
