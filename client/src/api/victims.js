import api from './index'

export const victimApi = {
  getVictims: async (params = {}) => {
    try {
      const res = await api.get('/victims', { params })
      return { data: res, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  getVictim: async (id) => {
    try {
      const res = await api.get(`/victims/${id}`)
      return { data: res, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  createVictim: async (data) => {
    try {
      const res = await api.post('/victims', data)
      return { data: res, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  updateVictim: async (id, data) => {
    try {
      const res = await api.put(`/victims/${id}`, data)
      return { data: res, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  deleteVictim: async (id) => {
    try {
      const res = await api.delete(`/victims/${id}`)
      return { data: res, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
}
