import api from './api';
import { USER_ROLES } from '../utils/constants';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
    }
    
    return response;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      this.clearAuth();
    }
  },

  async getProfile() {
    return await api.get('/auth/profile');
  },

  async updateProfile(data) {
    return await api.put('/auth/profile', data);
  },

  async changePassword(data) {
    return await api.post('/auth/change-password', data);
  },

  clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },

  getStoredUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // System Admin functions
  async createUser(userData) {
    return await api.post('/users', userData);
  },

  async getUsers(params = {}) {
    return await api.get('/users', { params });
  },

  async getUserById(id) {
    return await api.get(`/users/${id}`);
  },

  async updateUser(id, data) {
    return await api.put(`/users/${id}`, data);
  },

  async deleteUser(id) {
    return await api.delete(`/users/${id}`);
  },

  async getRoles() {
    return await api.get('/users/roles');
  },
};