import React, { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import expenseService from '../services/expenseService';
import ExpenseList from '../components/ExpenseList';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import { formatCurrency } from '../utils/formatCurrency';
import { PlusCircle, Receipt, Download } from 'lucide-react';

export const Expenses = () => {
  const { refreshKey, triggerRefresh, openQuickAdd, deleteExpenseWithConfirmation, showToast } = useExpenses();

  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: '',
    payment_method: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    search: '',
    is_necessary: '',
    sortBy: 'newest'
  });

  const [modalExpense, setModalExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const res = await expenseService.getExpenses(filters);
        if (isMounted) {
          setExpenses(res.data?.expenses || []);
          setPagination(res.data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
        }
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExpenses();

    return () => {
      isMounted = false;
    };
  }, [filters, refreshKey]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleEdit = (expense) => {
    setModalExpense(expense);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setModalExpense(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (modalExpense) {
        await expenseService.updateExpense(modalExpense.id, formData);
        showToast('Expense updated successfully!', 'success');
      } else {
        await expenseService.createExpense(formData);
        showToast('Expense recorded successfully!', 'success');
      }
      setIsModalOpen(false);
      setModalExpense(null);
      triggerRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick total calculation for filtered items
  const filteredTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <Receipt className="w-6 h-6 text-indigo-400" />
            <span>Manage All Expenses</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Search, filter, update, and categorize every single rupee you spend.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filtered stats summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <p className="text-[11px] font-bold uppercase text-slate-400">Total Filtered</p>
          <p className="text-lg font-black text-white">{formatCurrency(filteredTotal, true)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <p className="text-[11px] font-bold uppercase text-slate-400">Records Found</p>
          <p className="text-lg font-black text-indigo-400">{pagination.total} transactions</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <p className="text-[11px] font-bold uppercase text-slate-400">Current Page</p>
          <p className="text-lg font-black text-slate-300">
            {pagination.page} of {pagination.totalPages}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <p className="text-[11px] font-bold uppercase text-slate-400">Active Sort</p>
          <p className="text-sm font-bold text-slate-300 capitalize truncate mt-1">
            {filters.sortBy.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Main Expense List Component */}
      <ExpenseList
        expenses={expenses}
        pagination={pagination}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onEditExpense={handleEdit}
        onDeleteExpense={deleteExpenseWithConfirmation}
        onOpenAdd={handleOpenAdd}
      />

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalExpense(null);
        }}
        title={modalExpense ? 'Edit Expense' : 'Log New Expense'}
        maxWidth="max-w-lg"
      >
        <ExpenseForm
          initialData={modalExpense}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setModalExpense(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Expenses;
