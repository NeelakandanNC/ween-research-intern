import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { internshipApi, applicationApi, bookmarkApi } from '../lib/api'
import { CardSkeleton } from '../components/ui/Skeleton'
import InternshipCard from '../components/student/InternshipCard'
import FilterPanel from '../components/student/FilterPanel'
import { sortByMatchScore } from '../utils/matchAlgorithm'
import {
    Search,
    Filter,
    X,
    BookOpen,
    TrendingUp,
    Briefcase,
    Bookmark
} from 'lucide-react'

const StudentDashboard = () => {
    const { user } = useAuth()
    const { success, error: toastError } = useToast()

    const [internships, setInternships] = useState([])
    const [filteredInternships, setFilteredInternships] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState({
        researchArea: '',
        skills: [],
        sortBy: 'match'
    })
    const [bookmarks, setBookmarks] = useState([])
    const [applications, setApplications] = useState([])

    const studentProfile = user?.student

    const fetchInternships = useCallback(async () => {
        try {
            setLoading(true)
            const { internships: data } = await internshipApi.getAll({ status: 'active' })
            setInternships(data || [])
        } catch (err) {
            console.error('Error fetching internships:', err)
            toastError('Failed to load internships')
        } finally {
            setLoading(false)
        }
    }, [toastError])

    const fetchBookmarks = useCallback(async () => {
        try {
            const { bookmarks: data } = await bookmarkApi.getMyBookmarks()
            setBookmarks(data?.map(b => b.internshipId) || [])
        } catch (err) {
            console.error('Error fetching bookmarks:', err)
        }
    }, [])

    const fetchApplications = useCallback(async () => {
        try {
            const { applications: data } = await applicationApi.getMyApplications()
            setApplications(data?.map(a => a.internshipId) || [])
        } catch (err) {
            console.error('Error fetching applications:', err)
        }
    }, [])

    useEffect(() => {
        fetchInternships()
        fetchBookmarks()
        fetchApplications()
    }, [fetchInternships, fetchBookmarks, fetchApplications])

    useEffect(() => {
        applyFilters()
    }, [internships, searchTerm, filters, studentProfile])

    const applyFilters = () => {
        let result = [...internships]

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(i =>
                i.title.toLowerCase().includes(term) ||
                i.description.toLowerCase().includes(term) ||
                i.researchArea?.toLowerCase().includes(term) ||
                i.professor?.user?.name?.toLowerCase().includes(term)
            )
        }

        // Research area filter
        if (filters.researchArea) {
            result = result.filter(i => i.researchArea === filters.researchArea)
        }

        // Skills filter
        if (filters.skills.length > 0) {
            result = result.filter(i =>
                filters.skills.some(skill =>
                    i.requiredSkills?.some(rs =>
                        rs.toLowerCase().includes(skill.toLowerCase())
                    )
                )
            )
        }

        // Sort by match score if student has skills
        if (studentProfile?.skills?.length > 0) {
            result = sortByMatchScore(result, studentProfile.skills)
        }

        setFilteredInternships(result)
    }

    const handleApply = async (internshipId) => {
        try {
            await applicationApi.apply(internshipId)
            success('Application submitted successfully!')
            setApplications(prev => [...prev, internshipId])
        } catch (err) {
            console.error('Error applying:', err)
            if (err.message?.includes('already')) {
                toastError('You have already applied to this internship')
            } else {
                toastError(err.message || 'Failed to submit application')
            }
        }
    }

    const handleBookmark = async (internshipId) => {
        const isBookmarked = bookmarks.includes(internshipId)

        try {
            if (isBookmarked) {
                await bookmarkApi.remove(internshipId)
                setBookmarks(prev => prev.filter(id => id !== internshipId))
                success('Removed from bookmarks')
            } else {
                await bookmarkApi.add(internshipId)
                setBookmarks(prev => [...prev, internshipId])
                success('Added to bookmarks')
            }
        } catch (err) {
            console.error('Error toggling bookmark:', err)
            toastError(err.message || 'Failed to update bookmark')
        }
    }

    // Stats
    const stats = {
        total: filteredInternships.length,
        goodMatches: filteredInternships.filter(i => i.matchScore >= 60).length,
        applied: applications.length,
        bookmarked: bookmarks.length
    }

    // Get unique research areas for filter
    const researchAreas = [...new Set(internships.map(i => i.researchArea).filter(Boolean))].sort()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
                <p className="text-gray-500 mt-1">Discover research opportunities that match your skills</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-500">Available</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.goodMatches}</p>
                            <p className="text-sm text-gray-500">Good Matches</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
                            <p className="text-sm text-gray-500">Applied</p>
                        </div>
                    </div>
                </div>
                <div className="glass rounded-2xl p-5 card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Bookmark className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.bookmarked}</p>
                            <p className="text-sm text-gray-500">Bookmarked</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-12"
                        placeholder="Search internships, professors, research areas..."
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-primary-50 border-primary-300' : ''}`}
                >
                    <Filter className="w-5 h-5" />
                    Filters
                    {(filters.researchArea || filters.skills.length > 0) && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <FilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    researchAreas={researchAreas}
                    onClose={() => setShowFilters(false)}
                />
            )}

            {/* Internship List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : filteredInternships.length === 0 ? (
                    <div className="col-span-full glass rounded-2xl p-12 text-center">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No internships found</h3>
                        <p className="text-gray-500">
                            {searchTerm || filters.researchArea || filters.skills.length > 0
                                ? 'Try adjusting your search or filters'
                                : 'Check back later for new opportunities'}
                        </p>
                    </div>
                ) : (
                    filteredInternships.map(internship => (
                        <InternshipCard
                            key={internship.id}
                            internship={internship}
                            isBookmarked={bookmarks.includes(internship.id)}
                            hasApplied={applications.includes(internship.id)}
                            onApply={() => handleApply(internship.id)}
                            onBookmark={() => handleBookmark(internship.id)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default StudentDashboard
