import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth'
import {
    GraduationCap,
    Menu,
    X,
    LogOut,
    User,
    Bookmark,
    FileText,
    LayoutDashboard
} from 'lucide-react'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, signOut } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    const studentLinks = [
        { path: '/dashboard', label: 'Browse', icon: LayoutDashboard },
        { path: '/my-applications', label: 'Applications', icon: FileText },
        { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    ]

    const professorLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]

    const navLinks = user?.role === 'professor' ? professorLinks : studentLinks

    return (
        <nav className="glass sticky top-0 z-40 border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-lg gradient-text hidden sm:block">
                            Ween
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {user && navLinks.map(link => {
                            const Icon = link.icon
                            const isActive = location.pathname === link.path
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
                    ${isActive
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/50 rounded-xl">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-800">{user?.name}</p>
                                        <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && user && (
                    <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                        <div className="flex flex-col gap-1">
                            {navLinks.map(link => {
                                const Icon = link.icon
                                const isActive = location.pathname === link.path
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                      ${isActive
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }
                    `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
