import { useState, useEffect, useCallback } from 'react'
import { internshipApi, applicationApi } from '../../../lib/api'
import { useToast } from '../../../components/common/Toast'
import Modal, { ConfirmModal } from '../../../components/common/Modal'
import { StatusBadge, SkillBadge } from '../../../components/common/Badge'
import { ProfileSkeleton } from '../../../components/common/Skeleton'
import {
    User,
    Mail,
    GraduationCap,
    Star,
    Calendar,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    FileText
} from 'lucide-react'

const ApplicantModal = ({ isOpen, onClose, internship, onStatusUpdate }) => {
    const { success, error: toastError } = useToast()
    const [applicants, setApplicants] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedApplicant, setExpandedApplicant] = useState(null)
    const [confirmAction, setConfirmAction] = useState(null)
    const [processingId, setProcessingId] = useState(null)

    const fetchApplicants = useCallback(async () => {
        if (!internship?.id) return

        setLoading(true)
        try {
            const { applications } = await internshipApi.getApplicants(internship.id)
            setApplicants(applications || [])
        } catch (err) {
            console.error('Error fetching applicants:', err)
            toastError('Failed to load applicants')
        } finally {
            setLoading(false)
        }
    }, [internship?.id, toastError])

    useEffect(() => {
        if (isOpen && internship?.id) {
            fetchApplicants()
        }
    }, [isOpen, internship?.id, fetchApplicants])

    const handleStatusChange = async (applicationId, newStatus) => {
        setProcessingId(applicationId)
        try {
            await applicationApi.updateStatus(applicationId, { status: newStatus })
            success(`Application ${newStatus}!`)
            fetchApplicants()
            onStatusUpdate?.()
        } catch (err) {
            console.error('Error updating application:', err)
            toastError(err.message || 'Failed to update application')
        } finally {
            setProcessingId(null)
            setConfirmAction(null)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Applicants for ${internship?.title || 'Internship'}`}
            size="xl"
        >
            {loading ? (
                <div className="space-y-4">
                    <ProfileSkeleton />
                    <ProfileSkeleton />
                </div>
            ) : applicants.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
                    <p className="text-gray-500">Applications will appear here once students apply</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applicants.map(applicant => (
                        <div
                            key={applicant.id}
                            className={`border rounded-xl overflow-hidden transition-all ${expandedApplicant === applicant.id
                                ? 'border-primary-300 bg-primary-50/50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {/* Header */}
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer"
                                onClick={() => setExpandedApplicant(
                                    expandedApplicant === applicant.id ? null : applicant.id
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{applicant.student?.user?.name || 'Unknown'}</h4>
                                        <p className="text-sm text-gray-500">{applicant.student?.major || 'N/A'} · {applicant.student?.year || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={applicant.status} />
                                    {expandedApplicant === applicant.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedApplicant === applicant.id && (
                                <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <a href={`mailto:${applicant.student?.user?.email}`} className="hover:text-primary-600">
                                                {applicant.student?.user?.email || 'N/A'}
                                            </a>
                                        </div>
                                        {applicant.student?.gpa && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Star className="w-4 h-4" />
                                                <span>GPA: {applicant.student.gpa}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span>Applied: {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <GraduationCap className="w-4 h-4" />
                                            <span>{applicant.student?.year || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    {applicant.student?.skills?.length > 0 && (
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Skills</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {applicant.student.skills.map(skill => (
                                                    <SkillBadge key={skill} skill={skill} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience */}
                                    {applicant.student?.experience && (
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Experience</h5>
                                            <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                                                {applicant.student.experience}
                                            </p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {applicant.status === 'pending' && (
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => setConfirmAction({ id: applicant.id, action: 'accepted' })}
                                                disabled={processingId === applicant.id}
                                                className="flex-1 btn-primary flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => setConfirmAction({ id: applicant.id, action: 'rejected' })}
                                                disabled={processingId === applicant.id}
                                                className="flex-1 btn-danger flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Confirm Action Modal */}
            <ConfirmModal
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={() => handleStatusChange(confirmAction?.id, confirmAction?.action)}
                title={confirmAction?.action === 'accepted' ? 'Accept Application' : 'Reject Application'}
                message={
                    confirmAction?.action === 'accepted'
                        ? 'Are you sure you want to accept this application? The student will be notified.'
                        : 'Are you sure you want to reject this application? The student will be notified.'
                }
                confirmText={confirmAction?.action === 'accepted' ? 'Accept' : 'Reject'}
                variant={confirmAction?.action === 'accepted' ? 'primary' : 'danger'}
            />
        </Modal>
    )
}

export default ApplicantModal
