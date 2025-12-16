import axios from 'axios'

const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  timeout: 30000,
  // Token-based auth (Bearer). Cookie-based Sanctum auth requires a different backend login flow.
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // If Laravel returns data property, extract it
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data
    }
    return response.data || response
  },
  (error) => {
    const sanitizeErrorMessage = (message, status) => {
      const msg = typeof message === 'string' ? message : ''
      const lower = msg.toLowerCase()

      // Never leak database details to the UI.
      if (msg.includes('SQLSTATE') || lower.includes('mysql') || lower.includes('pdoexception')) {
        // Only call it a connection issue if it really looks like one.
        const looksLikeConnectionIssue =
          lower.includes('no connection could be made') ||
          lower.includes('actively refused') ||
          lower.includes('connection refused') ||
          lower.includes('access denied') ||
          lower.includes('could not find driver') ||
          /sqlstate\[hy000\]\s*\[2002\]/i.test(msg) ||
          /sqlstate\[hy000\]\s*\[1045\]/i.test(msg)

        if (looksLikeConnectionIssue) {
          return 'Service is unavailable (database connection issue). Please try again later.'
        }

        return 'A database error occurred. Please try again later.'
      }

      // Common infra/backend down cases.
      if (status === 503) {
        return 'Service temporarily unavailable. Please try again later.'
      }

      if (status === 500) {
        return 'Service is unavailable due to a server error. Please try again later.'
      }

      return message
    }

    // Simple retry for transient timeouts or network errors
    const config = error.config || {}
    const shouldRetry =
      (error.code === 'ECONNABORTED' || !error.response) &&
      (config.method === 'get') &&
      config.__skipRetry !== true
    const retryCount = config.__retryCount || 0
    const maxRetries = 2

    if (shouldRetry && retryCount < maxRetries) {
      config.__retryCount = retryCount + 1
      const backoffMs = 1000 * Math.pow(2, retryCount) // 1s, 2s
      return new Promise((resolve) => setTimeout(resolve, backoffMs)).then(() => api(config))
    }

    const status = error.response?.status
    const requestUrl = (error.config?.url || '').toString()
    const isLoginRequest = /(^|\/)login(\?|$)/.test(requestUrl)

    // Network errors: backend not running, wrong URL/port, CORS, or proxy issues.
    if (!error.response) {
      const errorData = {
        message: `Cannot reach API server. Please ensure the backend is running and VITE_API_URL points to it (current: ${DEFAULT_API_BASE_URL}).`,
        status: undefined,
        errors: null,
        original: error,
      }
      console.error('API Error:', errorData)
      return Promise.reject(errorData)
    }

    const rawMessage = error.response?.data?.message || error.message
    const errorMessage = (status === 401 && isLoginRequest)
      ? 'Wrong email or password.'
      : sanitizeErrorMessage(rawMessage, status)
    const errorData = {
      message: errorMessage,
      status,
      errors: error.response?.data?.errors || null,
      original: error,
    }

    console.error('API Error:', errorData)

    // Handle unauthorized (token expired/invalid)
    // For invalid login credentials, do not redirect; let the Login UI show the message.
    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(errorData)
  }
)

export default api
