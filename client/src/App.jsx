import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastProvider } from './components/common/Toast'
import { AuthProvider, useAuth } from './features/auth'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Pages
import Landing from './pages/Landing'
import { Login, Register } from './features/auth'
import { StudentDashboard } from './features/internships'
import { MyApplications } from './features/applications'
import { Bookmarks } from './features/bookmarks'
import { ProfessorDashboard } from './features/professor'

const DashboardRouter = () => {
    const { user } = useAuth()

    if (user?.role === 'professor') {
        return <ProfessorDashboard />
    }
    return <StudentDashboard />
}

// Layout wrapper that conditionally shows navbar
const AppLayout = ({ children }) => {
    const location = useLocation()
    const isLandingPage = location.pathname === '/'

    if (isLandingPage) {
        return children
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
            <Navbar />
            {children}
        </div>
    )
}

function AppRoutes() {
    const { user } = useAuth()

    return (
        <AppLayout>
            <Routes>
                {/* Landing Page - redirect to dashboard if logged in */}
                <Route
                    path="/"
                    element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
                />

                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardRouter />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-applications"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bookmarks"
                    element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <Bookmarks />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppLayout>
    )
}

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    )
}

export default App
