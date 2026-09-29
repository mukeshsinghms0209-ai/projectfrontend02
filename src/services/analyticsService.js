import api from './api';

export const analyticsService = {
  async getSummary(params = {}) {
    const response = await api.get('/analytics/summary', { params });
    return response.data;
  },

  async getCategoryBreakdown(params = {}) {
    const response = await api.get('/analytics/category', { params });
    return response.data;
  },

  async getDailySpending(days = 14) {
    const response = await api.get('/analytics/daily', { params: { days } });
    return response.data;
  },

  async getMonthlySpending(months = 6) {
    const response = await api.get('/analytics/monthly', { params: { months } });
    return response.data;
  },

  async getNecessaryVsOptional(params = {}) {
    const response = await api.get('/analytics/necessary-vs-optional', { params });
    return response.data;
  },

  async getRecommendations() {
    const response = await api.get('/recommendations');
    return response.data;
  }
};

export default analyticsService;
