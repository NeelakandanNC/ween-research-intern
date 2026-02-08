import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'
import { useToast } from '../../../components/common/Toast'
import { bookmarkApi, applicationApi } from '../../../lib/api'
import { CardSkeleton } from '../../../components/common/Skeleton'
import { InternshipCard } from '../../internships'
import { sortByMatchScore } from '../../../lib/matchAlgorithm'
import { Bookmark, ArrowLeft } from 'lucide-react'

const Bookmarks = () => {
    const { user } = useAuth()
    const { success, error: toastError } = useToast()

    const [bookmarkedInternships, setBookmarkedInternships] = useState([])
    const [loading, setLoading] = useState(true)
    const [applications, setApplications] = useState([])

    const studentProfile = user?.student

    const fetchBookmarks = useCallback(async () => {
        try {
            setLoading(true)
            const { bookmarks } = await bookmarkApi.getMyBookmarks()

            let internships = bookmarks?.map(b => b.internship).filter(Boolean) || []

            // Add match scores if student has skills
            if (studentProfile?.skills?.length > 0) {
                internships = sortByMatchScore(internships, studentProfile.skills)
            }

            setBookmarkedInternships(internships)
        } catch (err) {
            console.error('Error fetching bookmarks:', err)
            toastError('Failed to load bookmarks')
        } finally {
            setLoading(false)
        }
    }, [studentProfile?.skills, toastError])

    const fetchApplications = useCallback(async () => {
        try {
            const { applications: data } = await applicationApi.getMyApplications()
            setApplications(data?.map(a => a.internshipId) || [])
        } catch (err) {
            console.error('Error fetching applications:', err)
        }
    }, [])

    useEffect(() => {
        fetchBookmarks()
        fetchApplications()
    }, [fetchBookmarks, fetchApplications])

    const handleApply = async (internshipId) => {
        try {
            await applicationApi.apply(internshipId)
            success('Application submitted successfully!')
            setApplications(prev => [...prev, internshipId])
        } catch (err) {
            console.error('Error applying:', err)
            toastError(err.message || 'Failed to submit application')
        }
    }

    const handleRemoveBookmark = async (internshipId) => {
        try {
            await bookmarkApi.remove(internshipId)
            setBookmarkedInternships(prev => prev.filter(i => i.id !== internshipId))
            success('Removed from bookmarks')
        } catch (err) {
            console.error('Error removing bookmark:', err)
            toastError(err.message || 'Failed to remove bookmark')
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to browse
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Saved Internships</h1>
                <p className="text-gray-500 mt-1">
                    {bookmarkedInternships.length} internship{bookmarkedInternships.length !== 1 ? 's' : ''} saved
                </p>
            </div>

            {/* Bookmarked Internships */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : bookmarkedInternships.length === 0 ? (
                    <div className="col-span-full glass rounded-2xl p-12 text-center">
                        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved internships</h3>
                        <p className="text-gray-500 mb-6">
                            Browse internships and bookmark the ones you're interested in
                        </p>
                        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                            Browse Internships
                        </Link>
                    </div>
                ) : (
                    bookmarkedInternships.map(internship => (
                        <InternshipCard
                            key={internship.id}
                            internship={internship}
                            isBookmarked={true}
                            hasApplied={applications.includes(internship.id)}
                            onApply={() => handleApply(internship.id)}
                            onBookmark={() => handleRemoveBookmark(internship.id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default Bookmarks
