import { Clock, CheckCircle, XCircle, Zap, Archive } from 'lucide-react'

const Badge = ({ variant = 'default', children, icon, className = '' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        pending: 'bg-amber-100 text-amber-800',
        accepted: 'bg-emerald-100 text-emerald-800',
        rejected: 'bg-red-100 text-red-800',
        active: 'bg-primary-100 text-primary-800',
        closed: 'bg-gray-200 text-gray-600',
        match: 'bg-accent-100 text-accent-800',
        skill: 'bg-blue-100 text-blue-700',
    }

    const icons = {
        pending: <Clock className="w-3.5 h-3.5" />,
        accepted: <CheckCircle className="w-3.5 h-3.5" />,
        rejected: <XCircle className="w-3.5 h-3.5" />,
        active: <Zap className="w-3.5 h-3.5" />,
        closed: <Archive className="w-3.5 h-3.5" />
    }

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
        text-sm font-medium ${variants[variant]} ${className}
      `}
        >
            {icon || icons[variant]}
            {children}
        </span>
    )
}

export const MatchBadge = ({ score }) => {
    let variant = 'default'
    let label = 'No Match'

    if (score >= 80) {
        variant = 'accepted'
        label = `${score}% Match`
    } else if (score >= 60) {
        variant = 'active'
        label = `${score}% Match`
    } else if (score >= 40) {
        variant = 'pending'
        label = `${score}% Match`
    } else if (score > 0) {
        variant = 'default'
        label = `${score}% Match`
    }

    return (
        <Badge variant={variant} icon={<Zap className="w-3.5 h-3.5" />}>
            {label}
        </Badge>
    )
}

export const StatusBadge = ({ status }) => {
    const statusLabels = {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
        active: 'Active',
        closed: 'Closed'
    }

    return (
        <Badge variant={status}>
            {statusLabels[status] || status}
        </Badge>
    )
}

export const SkillBadge = ({ skill }) => {
    return (
        <Badge variant="skill">
            {skill}
        </Badge>
    )
}

export default Badge
