// userApi.js - UPDATED VERSION
import api from './index'

export const userApi = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getRoles: () => api.get('/users/roles'),
  getFocalPersons: () => api.get('/users/focal-persons'), // Fixed endpoint
  activateUser: (id) => api.post(`/users/${id}/activate`),
  deactivateUser: (id) => api.post(`/users/${id}/deactivate`),
  changeUserPassword: (id, data) => api.post(`/users/${id}/change-password`, data),
}