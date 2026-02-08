import { Router } from 'express'
import { signup, login, getMe, updateMe } from '../controllers/authController.js'
import { authenticate } from '../middleware/index.js'
import { validate, signupSchema, loginSchema } from '../utils/validation.js'

const router = Router()

// Public routes
router.post('/signup', validate(signupSchema), signup)
router.post('/login', validate(loginSchema), login)

// Protected routes
router.get('/me', authenticate, getMe)
router.put('/me', authenticate, updateMe)

export default router
