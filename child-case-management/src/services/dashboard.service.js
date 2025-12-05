import api from './api';

export const dashboardService = {
  async getDashboardStats(year, month) {
    return await api.get('/dashboard/stats', {
      params: { year, month },
    });
  },

  async getYearlyStats(years = 5) {
    return await api.get('/dashboard/yearly-stats', {
      params: { years },
    });
  },

  async getMonthlyStats(year) {
    return await api.get('/dashboard/monthly-stats', {
      params: { year },
    });
  },

  async getAbuseTypeStats() {
    return await api.get('/dashboard/abuse-type-stats');
  },

  async getActiveCases() {
    return await api.get('/dashboard/active-cases');
  },

  async getRecentCases(limit = 10) {
    return await api.get('/dashboard/recent-cases', {
      params: { limit },
    });
  },

  async getFocalPersonStats() {
    return await api.get('/dashboard/focal-person-stats');
  },

  async getCaseStatusStats() {
    return await api.get('/dashboard/case-status-stats');
  },
};