import api from './index'

export const perpetratorApi = {
  getPerpetrators: (params) => api.get('/perpetrators', { params }),
  searchPerpetrators: (search) => api.get('/perpetrators/search', { params: { search } }),
  getPerpetrator: (id) => api.get(`/perpetrators/${id}`),
  createPerpetrator: (data) => api.post('/perpetrators', data),
  updatePerpetrator: (id, data) => api.put(`/perpetrators/${id}`, data),
  deletePerpetrator: (id) => api.delete(`/perpetrators/${id}`),
}