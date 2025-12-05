import api from './api';

export const reportService = {
  async generateReport(params) {
    return await api.post('/reports/generate', params);
  },

  async downloadReport(reportId) {
    return await api.get(`/reports/download/${reportId}`, {
      responseType: 'blob',
    });
  },

  async getReportTemplates() {
    return await api.get('/reports/templates');
  },

  async getGeneratedReports(params = {}) {
    return await api.get('/reports/generated', { params });
  },

  async deleteReport(reportId) {
    return await api.delete(`/reports/${reportId}`);
  },
};