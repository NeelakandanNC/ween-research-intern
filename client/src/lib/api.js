// Production-grade API client with retry logic, token management, and error handling

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Token management
class TokenManager {
    static TOKEN_KEY = 'auth_token'
    static USER_KEY = 'auth_user'

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY)
    }

    static setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token)
    }

    static removeToken() {
        localStorage.removeItem(this.TOKEN_KEY)
    }

    static getUser() {
        const user = localStorage.getItem(this.USER_KEY)
        return user ? JSON.parse(user) : null
    }

    static setUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }

    static removeUser() {
        localStorage.removeItem(this.USER_KEY)
    }

    static clear() {
        this.removeToken()
        this.removeUser()
    }
}

// Custom API Error
class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.data = data
    }
}

// Request queue for preventing duplicate requests
const pendingRequests = new Map()

// API Client
class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL
        this.maxRetries = 3
        this.retryDelay = 1000
    }

    // Build headers with auth token
    getHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        }

        const token = TokenManager.getToken()
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        return headers
    }

    // Retry with exponential backoff
    async retryWithBackoff(fn, retries = this.maxRetries) {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn()
            } catch (error) {
                // Don't retry client errors (4xx) except 429
                if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
                    throw error
                }

                if (i === retries - 1) throw error

                const delay = this.retryDelay * Math.pow(2, i)
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    // Main request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`
        const method = options.method || 'GET'

        // Create request key for deduplication
        const requestKey = `${method}:${url}:${JSON.stringify(options.body || {})}`

        // Prevent duplicate GET requests
        if (method === 'GET' && pendingRequests.has(requestKey)) {
            return pendingRequests.get(requestKey)
        }

        const requestPromise = this.retryWithBackoff(async () => {
            const response = await fetch(url, {
                method,
                headers: this.getHeaders(options.headers),
                body: options.body ? JSON.stringify(options.body) : undefined,
                signal: options.signal
            })

            // Handle 401 - clear auth and redirect
            if (response.status === 401) {
                TokenManager.clear()
                window.dispatchEvent(new CustomEvent('auth:logout'))
            }

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new ApiError(
                    data.error || 'Request failed',
                    response.status,
                    data
                )
            }

            return data
        })

        // Track pending GET requests
        if (method === 'GET') {
            pendingRequests.set(requestKey, requestPromise)
            requestPromise.finally(() => pendingRequests.delete(requestKey))
        }

        return requestPromise
    }

    // HTTP method shortcuts
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' })
    }

    post(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'POST', body })
    }

    put(endpoint, body, options = {}) {
        return this.request(endpoint, { ...options, method: 'PUT', body })
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' })
    }
}

// Create singleton instance
const api = new ApiClient(API_BASE_URL)

// Auth API
export const authApi = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/me', data)
}

// Internship API
export const internshipApi = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return api.get(`/internships${query ? `?${query}` : ''}`)
    },
    getById: (id) => api.get(`/internships/${id}`),
    getMyInternships: () => api.get('/internships/my'),
    create: (data) => api.post('/internships', data),
    update: (id, data) => api.put(`/internships/${id}`, data),
    delete: (id) => api.delete(`/internships/${id}`),
    getApplicants: (id) => api.get(`/internships/${id}/applicants`)
}

// Application API
export const applicationApi = {
    getMyApplications: () => api.get('/applications/my'),
    apply: (internshipId) => api.post('/applications', { internshipId }),
    updateStatus: (id, data) => api.put(`/applications/${id}`, data)
}

// Bookmark API
export const bookmarkApi = {
    getMyBookmarks: () => api.get('/bookmarks'),
    add: (internshipId) => api.post('/bookmarks', { internshipId }),
    remove: (internshipId) => api.delete(`/bookmarks/${internshipId}`)
}

// Professor API
export const professorApi = {
    getAll: () => api.get('/professors'),
    getById: (id) => api.get(`/professors/${id}`),
    updateProfile: (data) => api.put('/professors/profile', data)
}

// Student API
export const studentApi = {
    getById: (id) => api.get(`/students/${id}`),
    updateProfile: (data) => api.put('/students/profile', data)
}

// Health check
export const healthApi = {
    check: () => api.get('/health')
}

// Export utilities
export { TokenManager, ApiError, api as default }
