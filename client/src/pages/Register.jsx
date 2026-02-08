import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import {
    GraduationCap,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    BookOpen,
    FlaskConical,
    Building,
    Star,
    ChevronRight
} from 'lucide-react'

const Register = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: '',
        // Professor fields
        department: '',
        research_areas: [],
        bio: '',
        // Student fields
        major: '',
        year: 'Freshman',
        gpa: '',
        skills: [],
        interests: [],
        experience: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [newSkill, setNewSkill] = useState('')
    const [newArea, setNewArea] = useState('')

    const { signUp } = useAuth()
    const { error: toastError, success } = useToast()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
            setNewSkill('')
        }
    }

    const removeSkill = (skill) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
    }

    const addResearchArea = () => {
        if (newArea.trim() && !formData.research_areas.includes(newArea.trim())) {
            setFormData(prev => ({ ...prev, research_areas: [...prev.research_areas, newArea.trim()] }))
            setNewArea('')
        }
    }

    const removeResearchArea = (area) => {
        setFormData(prev => ({ ...prev, research_areas: prev.research_areas.filter(a => a !== area) }))
    }

    const validateStep = () => {
        if (step === 1) {
            if (!formData.role) {
                setError('Please select a role')
                return false
            }
        } else if (step === 2) {
            if (!formData.name || !formData.email) {
                setError('Please fill in all required fields')
                return false
            }
            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters')
                return false
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match')
                return false
            }
        } else if (step === 3) {
            if (formData.role === 'professor') {
                if (!formData.department) {
                    setError('Please enter your department')
                    return false
                }
            } else {
                if (!formData.major) {
                    setError('Please enter your major')
                    return false
                }
            }
        }
        return true
    }

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1)
            setError('')
        }
    }

    const prevStep = () => {
        setStep(step - 1)
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateStep()) return

        setLoading(true)
        setError('')

        const { error } = await signUp(formData)

        if (error) {
            setError(error.message || 'Failed to create account')
            toastError('Failed to create account')
        } else {
            success('Account created successfully!')
            navigate('/dashboard')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-8">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200 to-primary-200 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-lg relative">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl mb-4">
                        <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center">
                            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                ${step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}
              `}>
                                {s}
                            </div>
                            {s < 3 && (
                                <ChevronRight className={`w-4 h-4 mx-1 ${step > s ? 'text-primary-500' : 'text-gray-300'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="glass rounded-3xl p-8 shadow-xl animate-slide-up">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Role Selection */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-center mb-6">I am a...</h2>

                                <button
                                    type="button"
                                    onClick={() => { setFormData(prev => ({ ...prev, role: 'professor' })); nextStep() }}
                                    className={`
                    w-full p-6 rounded-2xl border-2 transition-all text-left
                    ${formData.role === 'professor'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                                            <FlaskConical className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Professor</h3>
                                            <p className="text-gray-500 text-sm">Post internship opportunities for students</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setFormData(prev => ({ ...prev, role: 'student' })); nextStep() }}
                                    className={`
                    w-full p-6 rounded-2xl border-2 transition-all text-left
                    ${formData.role === 'student'
                                            ? 'border-accent-500 bg-accent-50'
                                            : 'border-gray-200 hover:border-accent-300 hover:bg-accent-50/50'
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Student</h3>
                                            <p className="text-gray-500 text-sm">Discover and apply for research internships</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* Step 2: Account Info */}
                        {step === 2 && (
                            <div className="space-y-5">
                                <h2 className="text-xl font-semibold text-center mb-6">Account Details</h2>

                                <div>
                                    <label className="input-label">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field pl-12"
                                            placeholder={formData.role === 'professor' ? 'Dr. Jane Smith' : 'John Doe'}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input-field pl-12"
                                            placeholder="you@university.edu"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="input-field pl-12 pr-12"
                                            placeholder="Min. 6 characters"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="input-field pl-12"
                                            placeholder="Confirm password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={prevStep} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button type="button" onClick={nextStep} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Role-specific Info */}
                        {step === 3 && formData.role === 'professor' && (
                            <div className="space-y-5">
                                <h2 className="text-xl font-semibold text-center mb-6">Professor Profile</h2>

                                <div>
                                    <label className="input-label">Department</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="input-field pl-12"
                                            placeholder="Computer Science"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Research Areas</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newArea}
                                            onChange={(e) => setNewArea(e.target.value)}
                                            className="input-field flex-1"
                                            placeholder="Add research area"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResearchArea())}
                                        />
                                        <button type="button" onClick={addResearchArea} className="btn-secondary px-4">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.research_areas.map(area => (
                                            <span key={area} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                                                {area}
                                                <button type="button" onClick={() => removeResearchArea(area)} className="hover:text-red-500">×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Bio (Optional)</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="input-field min-h-[100px]"
                                        placeholder="Brief description of your research..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={prevStep} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Create Account <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && formData.role === 'student' && (
                            <div className="space-y-5">
                                <h2 className="text-xl font-semibold text-center mb-6">Student Profile</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Major</label>
                                        <input
                                            type="text"
                                            name="major"
                                            value={formData.major}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Computer Science"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Year</label>
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="Freshman">Freshman</option>
                                            <option value="Sophomore">Sophomore</option>
                                            <option value="Junior">Junior</option>
                                            <option value="Senior">Senior</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">GPA (Optional)</label>
                                    <div className="relative">
                                        <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="number"
                                            name="gpa"
                                            value={formData.gpa}
                                            onChange={handleChange}
                                            className="input-field pl-12"
                                            placeholder="3.5"
                                            step="0.01"
                                            min="0"
                                            max="4"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Skills</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            className="input-field flex-1"
                                            placeholder="Add a skill (e.g., Python, React)"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        />
                                        <button type="button" onClick={addSkill} className="btn-secondary px-4">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map(skill => (
                                            <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                                                {skill}
                                                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Experience (Optional)</label>
                                    <textarea
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="input-field min-h-[80px]"
                                        placeholder="Brief description of relevant experience..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={prevStep} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Create Account <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <p className="text-center text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
