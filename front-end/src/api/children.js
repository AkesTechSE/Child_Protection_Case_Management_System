import api from './index'

export const childApi = {
  getChildren: (params) => api.get('/children', { params }),
  getChild: (id) => api.get(`/children/${id}`),
  createChild: (data) => api.post('/children', data),
  updateChild: (id, data) => api.put(`/children/${id}`, data),
  deleteChild: (id) => api.delete(`/children/${id}`),
}