import { internshipService } from '../services/index.js'
import { asyncHandler } from '../middleware/index.js'
import { HTTP_STATUS } from '../constants/index.js'

export const getAllInternships = asyncHandler(async (req, res) => {
    const result = await internshipService.getAll(req.query)
    res.json({ success: true, ...result })
})

export const getInternshipById = asyncHandler(async (req, res) => {
    const result = await internshipService.getById(req.params.id)
    res.json({ success: true, ...result })
})

export const getMyInternships = asyncHandler(async (req, res) => {
    const result = await internshipService.getMyInternships(req.user.id)
    res.json({ success: true, ...result })
})

export const createInternship = asyncHandler(async (req, res) => {
    const result = await internshipService.create(req.user.id, req.body)
    res.status(HTTP_STATUS.CREATED).json({ success: true, ...result })
})

export const updateInternship = asyncHandler(async (req, res) => {
    const result = await internshipService.update(req.params.id, req.user.id, req.body)
    res.json({ success: true, ...result })
})

export const deleteInternship = asyncHandler(async (req, res) => {
    const result = await internshipService.delete(req.params.id, req.user.id)
    res.json({ success: true, ...result })
})

export const getInternshipApplicants = asyncHandler(async (req, res) => {
    const result = await internshipService.getApplicants(req.params.id, req.user.id)
    res.json({ success: true, ...result })
})
