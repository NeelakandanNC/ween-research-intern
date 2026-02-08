import { Router } from 'express'
import { getMyBookmarks, createBookmark, deleteBookmark } from '../controllers/bookmarkController.js'
import { authenticate, isStudent } from '../middleware/index.js'
import { validate, createBookmarkSchema } from '../utils/validation.js'

const router = Router()

// All routes require authentication and student role
router.use(authenticate, isStudent)

router.get('/', getMyBookmarks)
router.post('/', validate(createBookmarkSchema), createBookmark)
router.delete('/:internshipId', deleteBookmark)

export default router
