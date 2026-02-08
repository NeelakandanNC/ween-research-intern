import { Router } from 'express'
import { getMyApplications, createApplication, updateApplication } from '../controllers/applicationController.js'
import { authenticate, isStudent, isProfessor } from '../middleware/index.js'
import { validate, createApplicationSchema, updateApplicationSchema } from '../utils/validation.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Student routes
router.get('/my', isStudent, getMyApplications)
router.post('/', isStudent, validate(createApplicationSchema), createApplication)

// Professor routes
router.put('/:id', isProfessor, validate(updateApplicationSchema), updateApplication)

export default router
