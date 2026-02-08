import { Router } from 'express'
import { getAllProfessors, getProfessorById, updateProfessorProfile } from '../controllers/professorController.js'
import { authenticate, isProfessor } from '../middleware/index.js'
import { validate, updateProfessorSchema } from '../utils/validation.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.get('/', getAllProfessors)
router.get('/:id', getProfessorById)
router.put('/profile', isProfessor, validate(updateProfessorSchema), updateProfessorProfile)

export default router
