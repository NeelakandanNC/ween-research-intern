import { authService } from '../services/index.js'
import { asyncHandler } from '../middleware/index.js'
import { HTTP_STATUS } from '../constants/index.js'

export const signup = asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body)
    res.status(HTTP_STATUS.CREATED).json({ success: true, ...result })
})

export const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body)
    res.json({ success: true, ...result })
})

export const getMe = asyncHandler(async (req, res) => {
    const result = await authService.getMe(req.user.id)
    res.json({ success: true, ...result })
})

export const updateMe = asyncHandler(async (req, res) => {
    const result = await authService.updateProfile(req.user.id, req.body)
    res.json({ success: true, ...result })
})
