import multer from 'multer'
import { BadRequestError } from '../errors/index.js'

// Configure multer for memory storage (we'll store as base64 in DB)
const storage = multer.memoryStorage()

// File filter - only allow PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(new BadRequestError('Only PDF files are allowed'), false)
    }
}

// CV upload config - 100KB limit
export const cvUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 // 100KB
    }
}).single('cv')

// Middleware wrapper for better error handling
export const handleCVUpload = (req, res, next) => {
    cvUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: 'File size exceeds 100KB limit'
                })
            }
            return res.status(400).json({
                success: false,
                error: err.message
            })
        } else if (err) {
            return res.status(400).json({
                success: false,
                error: err.message
            })
        }
        next()
    })
}
