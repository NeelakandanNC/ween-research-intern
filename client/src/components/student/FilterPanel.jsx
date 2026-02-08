import { useState } from 'react'
import { X, RotateCcw } from 'lucide-react'

const FilterPanel = ({ filters, setFilters, researchAreas, onClose }) => {
    const [skillInput, setSkillInput] = useState('')

    const addSkill = () => {
        if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
            setFilters(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }))
            setSkillInput('')
        }
    }

    const removeSkill = (skill) => {
        setFilters(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }))
    }

    const clearFilters = () => {
        setFilters({
            researchArea: '',
            skills: [],
            sortBy: 'match'
        })
    }

    const hasActiveFilters = filters.researchArea || filters.skills.length > 0

    return (
        <div className="glass rounded-2xl p-6 mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Clear all
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Research Area */}
                <div>
                    <label className="input-label">Research Area</label>
                    <select
                        value={filters.researchArea}
                        onChange={(e) => setFilters(prev => ({ ...prev, researchArea: e.target.value }))}
                        className="input-field"
                    >
                        <option value="">All research areas</option>
                        {researchAreas.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                </div>

                {/* Skills Filter */}
                <div>
                    <label className="input-label">Filter by Skills</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            className="input-field flex-1"
                            placeholder="Enter a skill"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <button onClick={addSkill} className="btn-secondary px-4">Add</button>
                    </div>
                </div>
            </div>

            {/* Active Skill Filters */}
            {filters.skills.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Filtering by skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {filters.skills.map(skill => (
                            <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent-100 text-accent-700 rounded-full text-sm">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Skill Suggestions */}
            <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                    {['Python', 'Machine Learning', 'React', 'Data Analysis', 'R', 'NLP', 'TensorFlow'].map(skill => (
                        <button
                            key={skill}
                            onClick={() => {
                                if (!filters.skills.includes(skill)) {
                                    setFilters(prev => ({ ...prev, skills: [...prev.skills, skill] }))
                                }
                            }}
                            disabled={filters.skills.includes(skill)}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${filters.skills.includes(skill)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-600 hover:bg-accent-100 hover:text-accent-700'
                                }`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FilterPanel
