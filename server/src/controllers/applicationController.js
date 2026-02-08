import { applicationService } from '../services/index.js'
import { asyncHandler } from '../middleware/index.js'
import { HTTP_STATUS } from '../constants/index.js'

export const getMyApplications = asyncHandler(async (req, res) => {
    const result = await applicationService.getMyApplications(req.user.id)
    res.json({ success: true, ...result })
})

export const createApplication = asyncHandler(async (req, res) => {
    const result = await applicationService.apply(req.user.id, req.body.internshipId)
    res.status(HTTP_STATUS.CREATED).json({ success: true, ...result })
})

export const updateApplication = asyncHandler(async (req, res) => {
    const result = await applicationService.updateStatus(req.params.id, req.user.id, req.body)
    res.json({ success: true, ...result })
})
