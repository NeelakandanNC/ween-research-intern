import { Router } from 'express'
import { getStudentById, updateStudentProfile, uploadCV, getCV, deleteCV, getCVStatus } from '../controllers/studentController.js'
import { authenticate, isStudent, handleCVUpload } from '../middleware/index.js'
import { validate, updateStudentSchema } from '../utils/validation.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.get('/:id', getStudentById)
router.put('/profile', isStudent, validate(updateStudentSchema), updateStudentProfile)

// CV routes
router.post('/cv', isStudent, handleCVUpload, uploadCV)           // Upload CV
router.get('/cv/status', isStudent, getCVStatus)                  // Get CV status
router.get('/:id/cv', getCV)                                      // Get student's CV (for professors)
router.delete('/cv', isStudent, deleteCV)                         // Delete CV

export default router
