import { professorService } from '../services/index.js'
import { asyncHandler } from '../middleware/index.js'

export const getAllProfessors = asyncHandler(async (req, res) => {
    const result = await professorService.getAll()
    res.json({ success: true, ...result })
})

export const getProfessorById = asyncHandler(async (req, res) => {
    const result = await professorService.getById(req.params.id)
    res.json({ success: true, ...result })
})

export const updateProfessorProfile = asyncHandler(async (req, res) => {
    const result = await professorService.updateProfile(req.user.id, req.body)
    res.json({ success: true, ...result })
})
