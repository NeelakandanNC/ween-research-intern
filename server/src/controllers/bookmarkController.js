import { bookmarkService } from '../services/index.js'
import { asyncHandler } from '../middleware/index.js'
import { HTTP_STATUS } from '../constants/index.js'

export const getMyBookmarks = asyncHandler(async (req, res) => {
    const result = await bookmarkService.getMyBookmarks(req.user.id)
    res.json({ success: true, ...result })
})

export const createBookmark = asyncHandler(async (req, res) => {
    const result = await bookmarkService.add(req.user.id, req.body.internshipId)
    res.status(HTTP_STATUS.CREATED).json({ success: true, ...result })
})

export const deleteBookmark = asyncHandler(async (req, res) => {
    const result = await bookmarkService.remove(req.user.id, req.params.internshipId)
    res.json({ success: true, ...result })
})
