import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, TokenManager } from '../lib/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Initialize auth state from stored token
    useEffect(() => {
        const initAuth = async () => {
            const token = TokenManager.getToken()
            const storedUser = TokenManager.getUser()

            if (token && storedUser) {
                try {
                    // Verify token is still valid
                    const { user } = await authApi.getMe()
                    setUser(user)
                    TokenManager.setUser(user)
                } catch (err) {
                    // Token invalid, clear storage
                    console.warn('Session expired, logging out')
                    TokenManager.clear()
                    setUser(null)
                }
            }

            setLoading(false)
        }

        initAuth()
    }, [])

    // Listen for logout events (triggered by 401 responses)
    useEffect(() => {
        const handleLogout = () => {
            setUser(null)
            TokenManager.clear()
        }

        window.addEventListener('auth:logout', handleLogout)
        return () => window.removeEventListener('auth:logout', handleLogout)
    }, [])

    const signUp = useCallback(async (userData) => {
        try {
            setError(null)
            const { user, token } = await authApi.signup(userData)

            TokenManager.setToken(token)
            TokenManager.setUser(user)
            setUser(user)

            return { user, error: null }
        } catch (err) {
            const errorMessage = err.message || 'Signup failed'
            setError(errorMessage)
            return { user: null, error: { message: errorMessage } }
        }
    }, [])

    const signIn = useCallback(async ({ email, password }) => {
        try {
            setError(null)
            const { user, token } = await authApi.login({ email, password })

            TokenManager.setToken(token)
            TokenManager.setUser(user)
            setUser(user)

            return { user, error: null }
        } catch (err) {
            const errorMessage = err.message || 'Login failed'
            setError(errorMessage)
            return { user: null, error: { message: errorMessage } }
        }
    }, [])

    const signOut = useCallback(async () => {
        TokenManager.clear()
        setUser(null)
        setError(null)
        return { error: null }
    }, [])

    const refreshUser = useCallback(async () => {
        try {
            const { user } = await authApi.getMe()
            setUser(user)
            TokenManager.setUser(user)
            return user
        } catch (err) {
            console.error('Failed to refresh user:', err)
            return null
        }
    }, [])

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isProfessor: user?.role === 'professor',
        isStudent: user?.role === 'student',
        signUp,
        signIn,
        signOut,
        refreshUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
