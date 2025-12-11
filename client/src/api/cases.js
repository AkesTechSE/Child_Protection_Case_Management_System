import api from './index'

export const caseApi = {
  getCases: async (params = {}) => {
    try {
      const res = await api.get('/cases', { params })
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  getCase: async (id) => {
    try {
      const res = await api.get(`/cases/${id}`)
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  getCaseStats: async (id) => {
    try {
      const res = await api.get(`/cases/${id}/stats`)
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  getCaseNotes: async (id) => {
    try {
      const res = await api.get(`/cases/${id}/notes`)
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  createCase: async (data) => {
    try {
      const res = await api.post('/cases', data)
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  updateCase: async (id, data) => {
    try {
      const res = await api.put(`/cases/${id}`, data)
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  deleteCase: async (id) => {
    try {
      const res = await api.delete(`/cases/${id}`)
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  addNote: async (id, data) => {
    try {
      const res = await api.post(`/cases/${id}/notes`, data)
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  deleteNote: async (id, noteId) => {
    try {
      const res = await api.delete(`/cases/${id}/notes/${noteId}`)
      return { data: res.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
}
