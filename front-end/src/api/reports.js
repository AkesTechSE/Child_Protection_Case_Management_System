// reportApi.js - UPDATED VERSION
import api from './index'

export const reportApi = {
  generateReport: (params, options = {}) => api.get('/reports/generate', { params, ...options }),
  generateCasesReport: (params, options = {}) => api.get('/reports/cases', { params, ...options }),
  generateVictimsReport: (params, options = {}) => api.get('/reports/victims', { params, ...options }),
  generatePerpetratorsReport: (params, options = {}) => api.get('/reports/perpetrators', { params, ...options }),
  generateIncidentReport: (params, options = {}) => api.get('/reports/incidents', { params, ...options }),
  generateComprehensiveReport: (params, options = {}) => api.get('/reports/comprehensive', { params, ...options }),
}