import { useState, useEffect } from 'react'
import { Calendar, Clock, X } from 'lucide-react'

const InternshipForm = ({ internship, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: [],
        duration: '',
        timeCommitment: '',
        researchArea: '',
        deadline: '',
        positionsAvailable: 1,
        status: 'active'
    })
    const [newSkill, setNewSkill] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (internship) {
            setFormData({
                title: internship.title || '',
                description: internship.description || '',
                requiredSkills: internship.requiredSkills || [],
                duration: internship.duration || '',
                timeCommitment: internship.timeCommitment || '',
                researchArea: internship.researchArea || '',
                deadline: internship.deadline ? new Date(internship.deadline).toISOString().split('T')[0] : '',
                positionsAvailable: internship.positionsAvailable || 1,
                status: internship.status || 'active'
            })
        }
    }, [internship])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const addSkill = () => {
        if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, newSkill.trim()]
            }))
            setNewSkill('')
        }
    }

    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(s => s !== skill)
        }))
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (!formData.duration.trim()) newErrors.duration = 'Duration is required'
        if (!formData.timeCommitment.trim()) newErrors.timeCommitment = 'Time commitment is required'
        if (!formData.researchArea.trim()) newErrors.researchArea = 'Research area is required'
        if (!formData.deadline) newErrors.deadline = 'Deadline is required'
        if (formData.requiredSkills.length === 0) newErrors.requiredSkills = 'Add at least one required skill'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        await onSubmit({
            ...formData,
            deadline: new Date(formData.deadline).toISOString(),
            positionsAvailable: parseInt(formData.positionsAvailable)
        })
        setLoading(false)
    }

    const researchAreas = [
        'Machine Learning',
        'Natural Language Processing',
        'Computer Vision',
        'Human-Computer Interaction',
        'UX Design',
        'Web Development',
        'Computational Biology',
        'Genomics',
        'Data Science',
        'Cloud Computing',
        'Distributed Systems',
        'Cybersecurity',
        'Robotics',
        'Artificial Intelligence'
    ]

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="input-label">Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
                    placeholder="e.g., ML Research Assistant"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
                <label className="input-label">Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`input-field min-h-[120px] ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
                    placeholder="Describe the internship role, responsibilities, and what students will learn..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
                <label className="input-label">Research Area *</label>
                <select
                    name="researchArea"
                    value={formData.researchArea}
                    onChange={handleChange}
                    className={`input-field ${errors.researchArea ? 'border-red-300 focus:ring-red-500' : ''}`}
                >
                    <option value="">Select research area</option>
                    {researchAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                </select>
                {errors.researchArea && <p className="text-red-500 text-sm mt-1">{errors.researchArea}</p>}
            </div>

            <div>
                <label className="input-label">Required Skills *</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="input-field flex-1"
                        placeholder="Add a required skill"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <button type="button" onClick={addSkill} className="btn-secondary px-4">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.requiredSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
                {errors.requiredSkills && <p className="text-red-500 text-sm mt-1">{errors.requiredSkills}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="input-label">Duration *</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className={`input-field pl-12 ${errors.duration ? 'border-red-300 focus:ring-red-500' : ''}`}
                            placeholder="e.g., 3 months"
                        />
                    </div>
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                </div>

                <div>
                    <label className="input-label">Time Commitment *</label>
                    <input
                        type="text"
                        name="timeCommitment"
                        value={formData.timeCommitment}
                        onChange={handleChange}
                        className={`input-field ${errors.timeCommitment ? 'border-red-300 focus:ring-red-500' : ''}`}
                        placeholder="e.g., 20 hours/week"
                    />
                    {errors.timeCommitment && <p className="text-red-500 text-sm mt-1">{errors.timeCommitment}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="input-label">Application Deadline *</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`input-field pl-12 ${errors.deadline ? 'border-red-300 focus:ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
                </div>

                <div>
                    <label className="input-label">Positions Available</label>
                    <input
                        type="number"
                        name="positionsAvailable"
                        value={formData.positionsAvailable}
                        onChange={handleChange}
                        min="1"
                        className="input-field"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button type="button" onClick={onCancel} className="btn-secondary flex-1">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                        internship ? 'Update Internship' : 'Create Internship'
                    )}
                </button>
            </div>
        </form>
    )
}

export default InternshipForm
