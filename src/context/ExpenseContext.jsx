import React, { createContext, useContext, useState, useCallback } from 'react';
import expenseService from '../services/expenseService';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [timeframe, setTimeframe] = useState('this_month');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const openQuickAdd = useCallback((expenseToEdit = null) => {
    setEditingExpense(expenseToEdit);
    setIsQuickAddOpen(true);
  }, []);

  const closeQuickAdd = useCallback(() => {
    setIsQuickAddOpen(false);
    setEditingExpense(null);
  }, []);

  const deleteExpenseWithConfirmation = useCallback(async (id) => {
    try {
      await expenseService.deleteExpense(id);
      showToast('Expense deleted successfully', 'info');
      triggerRefresh();
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete expense', 'error');
      return false;
    }
  }, [showToast, triggerRefresh]);

  const value = {
    refreshKey,
    triggerRefresh,
    isQuickAddOpen,
    editingExpense,
    openQuickAdd,
    closeQuickAdd,
    timeframe,
    setTimeframe,
    toast,
    showToast,
    deleteExpenseWithConfirmation
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export default ExpenseContext;
