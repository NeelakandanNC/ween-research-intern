import { useState, useEffect, useCallback } from 'react'
import { useToast } from '../components/ui/Toast'
import { applicationApi } from '../lib/api'
import { StatusBadge } from '../components/ui/Badge'
import { TableRowSkeleton } from '../components/ui/Skeleton'
import {
    FileText,
    Calendar,
    User,
    CheckCircle,
    XCircle,
    Hourglass
} from 'lucide-react'

const MyApplications = () => {
    const { error: toastError } = useToast()

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true)
            const { applications: data } = await applicationApi.getMyApplications()
            setApplications(data || [])
        } catch (err) {
            console.error('Error fetching applications:', err)
            toastError('Failed to load applications')
        } finally {
            setLoading(false)
        }
    }, [toastError])

    useEffect(() => {
        fetchApplications()
    }, [fetchApplications])

    const filteredApplications = filter === 'all'
        ? applications
        : applications.filter(a => a.status === filter)

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-500 mt-1">Track the status of your internship applications</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <button
                    onClick={() => setFilter('all')}
                    className={`glass rounded-2xl p-5 text-left transition-all ${filter === 'all' ? 'ring-2 ring-primary-500' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-500">Total</p>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`glass rounded-2xl p-5 text-left transition-all ${filter === 'pending' ? 'ring-2 ring-amber-500' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Hourglass className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            <p className="text-sm text-gray-500">Pending</p>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => setFilter('accepted')}
                    className={`glass rounded-2xl p-5 text-left transition-all ${filter === 'accepted' ? 'ring-2 ring-emerald-500' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
                            <p className="text-sm text-gray-500">Accepted</p>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`glass rounded-2xl p-5 text-left transition-all ${filter === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                            <p className="text-sm text-gray-500">Rejected</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Applications Table */}
            <div className="glass rounded-2xl overflow-hidden">
                {loading ? (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Position</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Professor</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Applied</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRowSkeleton />
                            <TableRowSkeleton />
                            <TableRowSkeleton />
                        </tbody>
                    </table>
                ) : filteredApplications.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
                        </h3>
                        <p className="text-gray-500">
                            {filter === 'all'
                                ? 'Start exploring internships and submit your first application!'
                                : 'No applications match this filter'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Position</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Professor</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Research Area</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Applied</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredApplications.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{app.internship?.title || 'Unknown'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600">{app.internship?.professor?.user?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
                                                {app.internship?.researchArea || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={app.status} />
                                            {app.respondedAt && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(app.respondedAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyApplications
