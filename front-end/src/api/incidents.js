import api from './index'

export const incidentApi = {
  getIncidents: (params = {}) => api.get('/incidents', { params }),
  getIncident: (id) => api.get(`/incidents/${id}`),

  createIncident: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (key === 'evidence_files' && data[key]) {
        data[key].forEach((file) => formData.append('evidence_files[]', file))
      } else {
        formData.append(key, data[key])
      }
    })

    return api.post('/incidents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  updateIncident: (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      const value = data[key]
      const shouldAppend =
        value !== undefined &&
        value !== null &&
        !(typeof value === 'string' && value.trim() === '')

      if (!shouldAppend) return

      if (key === 'evidence_files' && Array.isArray(value) && value.length > 0) {
        value.forEach((file) => formData.append('evidence_files[]', file))
      } else {
        formData.append(key, value)
      }
    })

    // Use POST with method override to ensure Laravel handles multipart updates reliably
    formData.append('_method', 'PUT')

    return api.post(`/incidents/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  deleteIncident: (id) => api.delete(`/incidents/${id}`),

  uploadAttachments: (id, files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('evidence_files[]', file))
    return api.post(`/incidents/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  removeAttachment: (id, filename) =>
    api.delete(`/incidents/${id}/attachments`, { data: { filename } }),

  downloadAttachment: (id, filename) =>
    api.get(`/incidents/${id}/attachments/download`, {
      params: { filename },
      responseType: 'blob',
    }),
}
