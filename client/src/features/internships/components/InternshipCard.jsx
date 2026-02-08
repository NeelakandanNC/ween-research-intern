import { MatchBadge, SkillBadge } from '../../../components/common/Badge'
import {
    User,
    Building,
    Calendar,
    Clock,
    Users,
    Bookmark,
    BookmarkMinus,
    ExternalLink,
    Send
} from 'lucide-react'

const InternshipCard = ({
    internship,
    isBookmarked,
    hasApplied,
    onApply,
    onBookmark
}) => {
    // Handle both Supabase and new API field naming conventions
    const professorName = internship.professor?.user?.name || internship.professors?.profiles?.name || 'Unknown Professor'
    const department = internship.professor?.department || internship.professors?.department || ''
    const researchArea = internship.researchArea || internship.research_area || ''
    const requiredSkills = internship.requiredSkills || internship.required_skills || []
    const timeCommitment = internship.timeCommitment || internship.time_commitment || ''
    const positionsAvailable = internship.positionsAvailable || internship.positions_available || 1

    const daysUntilDeadline = Math.ceil(
        (new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24)
    )

    return (
        <div className="glass rounded-2xl p-6 card-hover animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{internship.title}</h3>
                        {internship.matchScore !== undefined && (
                            <MatchBadge score={internship.matchScore} />
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {professorName}
                        </span>
                        {department && (
                            <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {department}
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={onBookmark}
                    className={`p-2 rounded-xl transition-all ${isBookmarked
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-amber-50 hover:text-amber-500'
                        }`}
                    title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                    {isBookmarked ? (
                        <BookmarkMinus className="w-5 h-5" />
                    ) : (
                        <Bookmark className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-3">{internship.description}</p>

            {/* Research Area */}
            {researchArea && (
                <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                        {researchArea}
                    </span>
                </div>
            )}

            {/* Skills */}
            {requiredSkills.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                        {requiredSkills.slice(0, 5).map(skill => (
                            <SkillBadge key={skill} skill={skill} />
                        ))}
                        {requiredSkills.length > 5 && (
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                                +{requiredSkills.length - 5} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {internship.duration}
                </span>
                {timeCommitment && (
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {timeCommitment}
                    </span>
                )}
                <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {positionsAvailable} position{positionsAvailable !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${daysUntilDeadline <= 7 ? 'text-red-600' : 'text-gray-500'}`}>
                    {daysUntilDeadline <= 0
                        ? 'Deadline passed'
                        : daysUntilDeadline === 1
                            ? '1 day left'
                            : `${daysUntilDeadline} days left`
                    }
                </div>

                {hasApplied ? (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-medium">
                        <Send className="w-4 h-4" />
                        Applied
                    </span>
                ) : (
                    <button
                        onClick={onApply}
                        disabled={daysUntilDeadline <= 0}
                        className="btn-primary flex items-center gap-2"
                    >
                        Apply Now
                        <ExternalLink className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default InternshipCard
