import { Router } from 'express'
import {
    getAllInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    getInternshipApplicants,
    getMyInternships
} from '../controllers/internshipController.js'
import { authenticate, isProfessor } from '../middleware/index.js'
import { validate, createInternshipSchema, updateInternshipSchema } from '../utils/validation.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Public routes (for authenticated users)
router.get('/', getAllInternships)
router.get('/my', isProfessor, getMyInternships)
router.get('/:id', getInternshipById)

// Professor-only routes
router.get('/:id/applicants', isProfessor, getInternshipApplicants)
router.post('/', isProfessor, validate(createInternshipSchema), createInternship)
router.put('/:id', isProfessor, validate(updateInternshipSchema), updateInternship)
router.delete('/:id', isProfessor, deleteInternship)

export default router
