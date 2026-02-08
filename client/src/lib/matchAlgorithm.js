/**
 * Calculate match score between student skills and internship required skills
 * @param {string[]} studentSkills - Array of student skills
 * @param {string[]} requiredSkills - Array of required skills for internship
 * @returns {number} - Match score as percentage (0-100)
 */
export function calculateMatchScore(studentSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 100
    if (!studentSkills || studentSkills.length === 0) return 0

    const studentSet = new Set(studentSkills.map(s => s.toLowerCase().trim()))
    const requiredSet = [...requiredSkills.map(s => s.toLowerCase().trim())]

    const matchCount = requiredSet.filter(skill => {
        // Check for exact match
        if (studentSet.has(skill)) return true

        // Check for partial matches (e.g., "machine learning" matches "ml")
        for (const studentSkill of studentSet) {
            if (
                studentSkill.includes(skill) ||
                skill.includes(studentSkill) ||
                areRelatedSkills(studentSkill, skill)
            ) {
                return true
            }
        }
        return false
    }).length

    return Math.round((matchCount / requiredSet.length) * 100)
}

/**
 * Check if two skills are related (handles common abbreviations and variations)
 */
function areRelatedSkills(skill1, skill2) {
    const relatedSkillsMap = {
        'ml': ['machine learning'],
        'ai': ['artificial intelligence'],
        'dl': ['deep learning'],
        'nlp': ['natural language processing'],
        'js': ['javascript'],
        'ts': ['typescript'],
        'py': ['python'],
        'db': ['database', 'databases'],
        'sql': ['mysql', 'postgresql', 'postgres'],
        'react': ['reactjs', 'react.js'],
        'node': ['nodejs', 'node.js'],
        'vue': ['vuejs', 'vue.js'],
        'angular': ['angularjs', 'angular.js'],
        'stats': ['statistics'],
        'viz': ['visualization', 'data visualization'],
        'ux': ['user experience', 'ux design'],
        'ui': ['user interface', 'ui design'],
    }

    // Normalize skills
    const s1 = skill1.toLowerCase().replace(/[.-]/g, '')
    const s2 = skill2.toLowerCase().replace(/[.-]/g, '')

    // Check direct relationship
    for (const [key, values] of Object.entries(relatedSkillsMap)) {
        const allRelated = [key, ...values]
        if (allRelated.some(r => s1.includes(r)) && allRelated.some(r => s2.includes(r))) {
            return true
        }
    }

    return false
}

/**
 * Get match level description based on score
 * @param {number} score - Match score (0-100)
 * @returns {object} - { level: string, color: string }
 */
export function getMatchLevel(score) {
    if (score >= 80) {
        return { level: 'Excellent Match', color: 'text-emerald-600', bg: 'bg-emerald-100' }
    } else if (score >= 60) {
        return { level: 'Good Match', color: 'text-primary-600', bg: 'bg-primary-100' }
    } else if (score >= 40) {
        return { level: 'Partial Match', color: 'text-amber-600', bg: 'bg-amber-100' }
    } else {
        return { level: 'Low Match', color: 'text-gray-600', bg: 'bg-gray-100' }
    }
}

/**
 * Sort internships by match score
 * @param {object[]} internships - Array of internship objects
 * @param {string[]} studentSkills - Array of student skills
 * @returns {object[]} - Sorted internships with matchScore property added
 */
export function sortByMatchScore(internships, studentSkills) {
    return internships
        .map(internship => ({
            ...internship,
            matchScore: calculateMatchScore(studentSkills, internship.required_skills)
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
}
