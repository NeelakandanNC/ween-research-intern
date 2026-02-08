import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { internshipApi } from '../lib/api'
import Modal, { ConfirmModal } from '../components/ui/Modal'
import { StatusBadge, SkillBadge } from '../components/ui/Badge'
import { CardSkeleton } from '../components/ui/Skeleton'
import InternshipForm from '../components/professor/InternshipForm'
import ApplicantModal from '../components/professor/ApplicantModal'
import {
    Plus,
    Users,
    Calendar,
    Clock,
    Edit,
    Trash2,
    Search,
    FlaskConical,
    FileText,
    TrendingUp,
    CheckCircle,
    XCircle
} from 'lucide-react'

const ProfessorDashboard = () => {
    const { user } = useAuth()
    const { success, error: toastError } = useToast()

    const [internships, setInternships] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showApplicantsModal, setShowApplicantsModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [selectedInternship, setSelectedInternship] = useState(null)

    const fetchInternships = useCallback(async () => {
        try {
            setLoading(true)
            const { internships: data } = await internshipApi.getMyInternships()
            setInternships(data || [])
        } catch (err) {
            console.error('Error fetching internships:', err)
            toastError('Failed to load internships')
        } finally {
            setLoading(false)
        }
    }, [toastError])

    useEffect(() => {
        fetchInternships()
    }, [fetchInternships])

    const handleCreateInternship = async (formData) => {
        try {
            await internshipApi.create(formData)
            success('Internship created successfully!')
            setShowCreateModal(false)
            fetchInternships()
        } catch (err) {
            console.error('Error creating internship:', err)
            toastError(err.message || 'Failed to create internship')
        }
    }

    const handleUpdateInternship = async (formData) => {
        try {
            await internshipApi.update(selectedInternship.id, formData)
            success('Internship updated successfully!')
            setShowEditModal(false)
            setSelectedInternship(null)
            fetchInternships()
        } catch (err) {
            console.error('Error updating internship:', err)
            toastError(err.message || 'Failed to update internship')
        }
    }

    const handleDeleteInternship = async () => {
        try {
            await internshipApi.delete(selectedInternship.id)
            success('Internship deleted successfully!')
            setShowDeleteConfirm(false)
            setSelectedInternship(null)
            fetchInternships()
        } catch (err) {
            console.error('Error deleting internship:', err)
            toastError(err.message || 'Failed to delete internship')
        }
    }

    const handleToggleStatus = async (internship) => {
        const newStatus = internship.status === 'active' ? 'closed' : 'active'
        try {
            await internshipApi.update(internship.id, { status: newStatus })
            success(`Internship ${newStatus === 'active' ? 'reopened' : 'closed'}!`)
            fetchInternships()
        } catch (err) {
            console.error('Error updating status:', err)
            toastError(err.message || 'Failed to update status')
        }
    }

    // Statistics
    const stats = {
        total: internships.length,
        active: internships.filter(i => i.status === 'active').length,
        totalApplications: internships.reduce((sum, i) => sum + (i._count?.applications || 0), 0),
        closed: internships.filter(i => i.status === 'closed').length
    }

    const filteredInternships = internships.filter(i =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
                        <p className="text-gray-500 mt-1">{user?.professor?.department || 'Professor'} · Manage your research internships</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create Internship
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <FlaskConical className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-500">Total Internships</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                            <p className="text-sm text-gray-500">Active Listings</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                            <p className="text-sm text-gray-500">Total Applications</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.closed}</p>
                            <p className="text-sm text-gray-500">Closed Positions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-12"
                        placeholder="Search internships..."
                    />
                </div>
            </div>

            {/* Internships List */}
            <div className="space-y-4">
                {loading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : filteredInternships.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No internships yet</h3>
                        <p className="text-gray-500 mb-6">Create your first research internship to start receiving applications</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Internship
                        </button>
                    </div>
                ) : (
                    filteredInternships.map(internship => (
                        <div key={internship.id} className="glass rounded-2xl p-6 card-hover animate-fade-in">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{internship.title}</h3>
                                            <StatusBadge status={internship.status} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setSelectedInternship(internship); setShowApplicantsModal(true) }}
                                                className="flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-600 rounded-xl hover:bg-accent-100 transition-colors"
                                            >
                                                <Users className="w-4 h-4" />
                                                <span className="font-medium">{internship._count?.applications || 0} Applicants</span>
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mb-4 line-clamp-2">{internship.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {internship.requiredSkills?.map(skill => (
                                            <SkillBadge key={skill} skill={skill} />
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {internship.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Deadline: {new Date(internship.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-2">
                                    <button
                                        onClick={() => { setSelectedInternship(internship); setShowEditModal(true) }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span className="lg:hidden">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(internship)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${internship.status === 'active'
                                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                            }`}
                                    >
                                        {internship.status === 'active' ? (
                                            <>
                                                <XCircle className="w-4 h-4" />
                                                <span className="lg:hidden">Close</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="lg:hidden">Open</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => { setSelectedInternship(internship); setShowDeleteConfirm(true) }}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="lg:hidden">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Internship"
                size="lg"
            >
                <InternshipForm onSubmit={handleCreateInternship} onCancel={() => setShowCreateModal(false)} />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => { setShowEditModal(false); setSelectedInternship(null) }}
                title="Edit Internship"
                size="lg"
            >
                <InternshipForm
                    internship={selectedInternship}
                    onSubmit={handleUpdateInternship}
                    onCancel={() => { setShowEditModal(false); setSelectedInternship(null) }}
                />
            </Modal>

            {/* Applicants Modal */}
            <ApplicantModal
                isOpen={showApplicantsModal}
                onClose={() => { setShowApplicantsModal(false); setSelectedInternship(null) }}
                internship={selectedInternship}
                onStatusUpdate={fetchInternships}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => { setShowDeleteConfirm(false); setSelectedInternship(null) }}
                onConfirm={handleDeleteInternship}
                title="Delete Internship"
                message="Are you sure you want to delete this internship? All applications will also be deleted."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    )
}

export default ProfessorDashboard
