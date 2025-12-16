// api/dashboard.js
import api from './index'

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats', { timeout: 15000 }),
  getAbuseTypeStats: () => api.get('/dashboard/abuse-type-stats', { timeout: 15000 }),
  getRecentCases: () => api.get('/dashboard/recent-cases', { timeout: 15000 }),
  getYearlyStats: (year) => api.get('/dashboard/yearly-stats', { params: { year }, timeout: 15000 }),
  getMonthlyStats: (year, month) => api.get('/dashboard/monthly-stats', { params: { year, month }, timeout: 15000 }),
  getPriorityStats: () => api.get('/dashboard/priority-stats', { timeout: 15000 }),
}