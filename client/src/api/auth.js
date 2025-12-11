import api from './index'

export const authApi = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.post('/change-password', data),

  // Optional health check
  testConnection: () =>
    api.get('/health').catch(() => ({
      status: 'offline',
      message: 'API not reachable',
    })),
}
