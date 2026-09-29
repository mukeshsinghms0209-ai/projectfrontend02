import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue client cleanup even if API fails
    } finally {
      localStorage.removeItem('teen_tracker_token');
      localStorage.removeItem('teen_tracker_user');
    }
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }
};

export default authService;
