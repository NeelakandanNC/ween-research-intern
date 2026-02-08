import { studentService } from '../services/index.js'
import { asyncHandler } from '../middleware/index.js'

export const getStudentById = asyncHandler(async (req, res) => {
    const result = await studentService.getById(req.params.id)
    res.json({ success: true, ...result })
})

export const updateStudentProfile = asyncHandler(async (req, res) => {
    const result = await studentService.updateProfile(req.user.id, req.body)
    res.json({ success: true, ...result })
})

// CV Upload
export const uploadCV = asyncHandler(async (req, res) => {
    const result = await studentService.uploadCV(req.user.id, req.file)
    res.json({ success: true, ...result })
})

// Get CV - returns PDF as base64 or as file download
export const getCV = asyncHandler(async (req, res) => {
    const result = await studentService.getCV(req.params.id, req.user.id)

    // Check if client wants JSON or file download
    if (req.query.download === 'true') {
        const pdfBuffer = Buffer.from(result.cvData, 'base64')
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${result.fileName}"`,
            'Content-Length': pdfBuffer.length
        })
        res.send(pdfBuffer)
    } else {
        res.json({
            success: true,
            fileName: result.fileName,
            uploadedAt: result.uploadedAt,
            cvData: result.cvData  // Base64 string
        })
    }
})

// Delete CV
export const deleteCV = asyncHandler(async (req, res) => {
    const result = await studentService.deleteCV(req.user.id)
    res.json({ success: true, ...result })
})

// Get CV Status
export const getCVStatus = asyncHandler(async (req, res) => {
    const result = await studentService.getCVStatus(req.user.id)
    res.json({ success: true, ...result })
})
