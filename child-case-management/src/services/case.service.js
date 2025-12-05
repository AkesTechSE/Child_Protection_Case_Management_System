import api from './api';

export const caseService = {
  async registerCase(caseData) {
    return await api.post('/cases', caseData);
  },

  async getCases(params = {}) {
    return await api.get('/cases', { params });
  },

  async getCaseById(id) {
    return await api.get(`/cases/${id}`);
  },

  async updateCase(id, data) {
    return await api.put(`/cases/${id}`, data);
  },

  async deleteCase(id) {
    return await api.delete(`/cases/${id}`);
  },

  async searchCases(searchParams) {
    return await api.get('/cases/search', { params: searchParams });
  },

  async getCaseStats() {
    return await api.get('/cases/stats');
  },

  async assignCase(caseId, focalPersonId) {
    return await api.post(`/cases/${caseId}/assign`, { focal_person_id: focalPersonId });
  },

  async updateCaseStatus(caseId, status) {
    return await api.put(`/cases/${caseId}/status`, { status });
  },

  async uploadEvidence(caseId, formData) {
    return await api.post(`/cases/${caseId}/evidence`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getEvidence(caseId) {
    return await api.get(`/cases/${caseId}/evidence`);
  },

  async deleteEvidence(caseId, evidenceId) {
    return await api.delete(`/cases/${caseId}/evidence/${evidenceId}`);
  },

  async addCaseNote(caseId, note) {
    return await api.post(`/cases/${caseId}/notes`, { note });
  },

  async getCaseNotes(caseId) {
    return await api.get(`/cases/${caseId}/notes`);
  },
};