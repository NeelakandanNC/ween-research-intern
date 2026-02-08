import config from '../config/index.js'

export const requestLogger = (req, res, next) => {
    const start = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - start
        const log = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
        }

        if (config.isDev) {
            const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'
            console.log(
                `${statusColor}${log.method}\x1b[0m ${log.url} - ${log.status} (${log.duration})`
            )
        } else {
            console.log(JSON.stringify(log))
        }
    })

    next()
}
