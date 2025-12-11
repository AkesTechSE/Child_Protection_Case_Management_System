import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add token
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
    const errorMessage = error.response?.data?.message || error.message
    const errorData = {
      message: errorMessage,
      status: error.response?.status,
      errors: error.response?.data?.errors || null,
      original: error,
    }

    console.error('API Error:', errorData)

    // Handle unauthorized (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(errorData)
  }
)

export default api
