import api from './index'

export const fetchNotifications = async () => {
  return api.get('/notifications')
}

export const createNotification = async (payload) => {
  return api.post('/notifications', payload)
}

export const markNotificationAsRead = async (id) => {
  return api.post(`/notifications/${id}/read`)
}
