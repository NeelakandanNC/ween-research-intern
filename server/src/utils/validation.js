import { z } from 'zod'

// Auth schemas
export const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
    role: z.enum(['professor', 'student'], { message: 'Role must be professor or student' }),
    // Optional role-specific fields
    department: z.string().optional(),
    researchAreas: z.array(z.string()).optional(),
    bio: z.string().optional(),
    major: z.string().optional(),
    year: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior']).optional(),
    gpa: z.number().min(0).max(4).optional().nullable(),
    skills: z.array(z.string()).optional(),
    experience: z.string().optional(),
    interests: z.array(z.string()).optional()
})

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
})

// Internship schemas
export const createInternshipSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    requiredSkills: z.array(z.string()).default([]),
    duration: z.string().min(1, 'Duration is required'),
    timeCommitment: z.string().min(1, 'Time commitment is required'),
    researchArea: z.string().min(1, 'Research area is required'),
    deadline: z.string().transform(str => new Date(str)),
    positionsAvailable: z.number().int().min(1).default(1)
})

export const updateInternshipSchema = createInternshipSchema.partial().extend({
    status: z.enum(['active', 'closed']).optional()
})

// Application schemas
export const createApplicationSchema = z.object({
    internshipId: z.string().uuid('Invalid internship ID')
})

export const updateApplicationSchema = z.object({
    status: z.enum(['pending', 'accepted', 'rejected']),
    professorNotes: z.string().optional()
})

// Profile update schemas
export const updateProfessorSchema = z.object({
    department: z.string().optional(),
    researchAreas: z.array(z.string()).optional(),
    bio: z.string().optional(),
    contactInfo: z.string().optional()
})

export const updateStudentSchema = z.object({
    major: z.string().optional(),
    year: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior']).optional(),
    gpa: z.number().min(0).max(4).optional().nullable(),
    skills: z.array(z.string()).optional(),
    coursework: z.array(z.string()).optional(),
    experience: z.string().optional(),
    interests: z.array(z.string()).optional(),
    resumeText: z.string().optional().nullable()
})

// Bookmark schema
export const createBookmarkSchema = z.object({
    internshipId: z.string().uuid('Invalid internship ID')
})

// Validation helper
export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body)
        next()
    } catch (error) {
        res.status(400).json({
            error: 'Validation failed',
            details: error.errors
        })
    }
}
