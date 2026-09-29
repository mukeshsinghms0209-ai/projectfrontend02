import api from './api';

export const budgetService = {
  async getBudgets() {
    const response = await api.get('/budgets');
    return response.data;
  },

  async createBudget(budgetData) {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  async updateBudget(id, budgetData) {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  },

  async deleteBudget(id) {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },

  async getSavingsGoal() {
    const response = await api.get('/budgets/savings-goal');
    return response.data;
  },

  async saveSavingsGoal(goalData) {
    const response = await api.post('/budgets/savings-goal', goalData);
    return response.data;
  }
};

export default budgetService;
