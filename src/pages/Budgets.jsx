import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import budgetService from '../services/budgetService';
import { useExpenses } from '../context/ExpenseContext';
import BudgetCard from '../components/BudgetCard';
import Modal from '../components/Modal';
import { SkeletonCard } from '../components/LoadingSpinner';
import { CATEGORIES } from '../utils/validation';
import { formatCurrency } from '../utils/formatCurrency';
import { PiggyBank, PlusCircle, Target, Sparkles, AlertCircle } from 'lucide-react';

export const Budgets = () => {
  const { refreshKey, triggerRefresh, showToast } = useExpenses();

  const [budgetsData, setBudgetsData] = useState({ budgets: [], summary: {} });
  const [savingsGoal, setSavingsGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Budget Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetForm, setBudgetForm] = useState({
    category: 'Food',
    amount: '',
    period: 'monthly'
  });

  // Savings Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    target_amount: '',
    current_amount: '',
    target_date: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBudgetsAndGoal = async () => {
      try {
        setLoading(true);
        const [budgetsRes, goalRes] = await Promise.all([
          budgetService.getBudgets(),
          budgetService.getSavingsGoal()
        ]);

        if (isMounted) {
          setBudgetsData(budgetsRes.data || { budgets: [], summary: {} });
          setSavingsGoal(goalRes.data?.goal || null);
        }
      } catch (err) {
        console.error('Failed to load budgets & goals:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBudgetsAndGoal();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // Handle Budget Submit
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!budgetForm.category || !budgetForm.amount || Number(budgetForm.amount) <= 0) {
      showToast('Please enter a valid budget amount greater than 0', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, {
          amount: parseFloat(budgetForm.amount),
          period: budgetForm.period
        });
        showToast('Budget updated successfully!', 'success');
      } else {
        await budgetService.createBudget({
          category: budgetForm.category,
          amount: parseFloat(budgetForm.amount),
          period: budgetForm.period
        });
        showToast('Budget category added!', 'success');
      }

      setIsBudgetModalOpen(false);
      setEditingBudget(null);
      triggerRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save budget', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setBudgetForm({
      category: budget.category,
      amount: String(budget.amount),
      period: budget.period || 'monthly'
    });
    setIsBudgetModalOpen(true);
  };

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Delete this budget limit?')) {
      try {
        await budgetService.deleteBudget(id);
        showToast('Budget deleted successfully', 'info');
        triggerRefresh();
      } catch (err) {
        showToast('Failed to delete budget', 'error');
      }
    }
  };

  // Savings Goal Handlers
  const handleOpenGoalModal = () => {
    if (savingsGoal) {
      setGoalForm({
        title: savingsGoal.title,
        target_amount: String(savingsGoal.target_amount),
        current_amount: String(savingsGoal.current_amount || 0),
        target_date: savingsGoal.target_date ? savingsGoal.target_date.split('T')[0] : ''
      });
    } else {
      setGoalForm({
        title: 'New Headphones / Laptop / Trip',
        target_amount: '5000',
        current_amount: '1000',
        target_date: ''
      });
    }
    setIsGoalModalOpen(true);
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim() || Number(goalForm.target_amount) <= 0) {
      showToast('Please enter a goal title and target amount', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await budgetService.saveSavingsGoal({
        title: goalForm.title.trim(),
        target_amount: parseFloat(goalForm.target_amount),
        current_amount: parseFloat(goalForm.current_amount || 0),
        target_date: goalForm.target_date || null
      });

      const updatedGoal = res.data?.goal;
      setSavingsGoal(updatedGoal);
      setIsGoalModalOpen(false);
      showToast('Savings goal updated! 🎯', 'success');

      // Check if goal reached 100% -> Trigger celebratory confetti!
      if (updatedGoal && Number(updatedGoal.current_amount) >= Number(updatedGoal.target_amount)) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save savings goal', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAddSavings = async (addAmount) => {
    if (!savingsGoal) return;
    const newCurrent = Number(savingsGoal.current_amount || 0) + addAmount;
    try {
      const res = await budgetService.saveSavingsGoal({
        title: savingsGoal.title,
        target_amount: savingsGoal.target_amount,
        current_amount: newCurrent,
        target_date: savingsGoal.target_date
      });
      setSavingsGoal(res.data?.goal);
      showToast(`Added ${formatCurrency(addAmount)} to your savings goal! 🚀`, 'success');

      if (newCurrent >= Number(savingsGoal.target_amount)) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      showToast('Failed to update savings amount', 'error');
    }
  };

  const savingsPct = savingsGoal && Number(savingsGoal.target_amount) > 0
    ? Math.min(100, Math.round((Number(savingsGoal.current_amount || 0) / Number(savingsGoal.target_amount)) * 100))
    : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <PiggyBank className="w-6 h-6 text-indigo-400" />
            <span>Budgets & Savings Goals</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Set spending limits by category and track your dream purchase goal.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBudget(null);
            setBudgetForm({ category: 'Food', amount: '', period: 'monthly' });
            setIsBudgetModalOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Budget Limit</span>
        </button>
      </div>

      {/* Teenager Savings Goal Spotlight Card (Section 45) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 inline-flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Teen Goal Spotlight</span>
              </span>
              {savingsPct >= 100 && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  🎉 Goal Reached!
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {savingsGoal ? savingsGoal.title : 'Set Your Dream Purchase Goal'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400">
              {savingsGoal
                ? `You've saved ${formatCurrency(savingsGoal.current_amount)} toward your ${formatCurrency(savingsGoal.target_amount)} goal!`
                : 'Saving for sneakers, a new console, or concert tickets? Track your progress here!'}
            </p>

            {/* Progress bar */}
            {savingsGoal && (
              <div className="space-y-1.5 pt-2 max-w-xl">
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700"
                    style={{ width: `${savingsPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>{savingsPct}% Completed</span>
                  <span className="text-indigo-300 font-mono">
                    {formatCurrency(savingsGoal.current_amount)} / {formatCurrency(savingsGoal.target_amount)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap md:flex-col gap-2">
            <button
              onClick={handleOpenGoalModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              {savingsGoal ? 'Edit Goal' : '+ Create Savings Goal'}
            </button>
            {savingsGoal && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickAddSavings(200)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold text-xs border border-indigo-500/30"
                >
                  +₹200
                </button>
                <button
                  onClick={() => handleQuickAddSavings(500)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold text-xs border border-indigo-500/30"
                >
                  +₹500
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Budget Utilization Summary */}
      {budgetsData.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs font-bold uppercase text-slate-400">Total Monthly Limit</p>
            <p className="text-2xl font-black text-white mt-1">
              {formatCurrency(budgetsData.summary.totalBudget || 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Combined limits across all categories</p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs font-bold uppercase text-slate-400">Total Spent So Far</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {formatCurrency(budgetsData.summary.totalSpent || 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {budgetsData.summary.overallPercentage || 0}% of budget utilized
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <p className="text-xs font-bold uppercase text-slate-400">Total Remaining</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {formatCurrency(budgetsData.summary.totalRemaining || 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Safe to spend this month</p>
          </div>
        </div>
      )}

      {/* Category Budgets Grid (Section 14) */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Category Budgets</h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : budgetsData.budgets.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <span className="text-3xl">🎯</span>
            <h4 className="text-base font-bold text-white">No category budgets created</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Setting category limits for Food, Entertainment, or Gaming helps you avoid overspending.
            </p>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
            >
              + Create First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetsData.budgets.map((b) => (
              <BudgetCard
                key={b.id}
                budget={b}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Budget Modal */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Category Budget' : 'Set Category Budget'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={budgetForm.category}
              disabled={!!editingBudget}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Monthly Budget Limit (₹)
            </label>
            <input
              type="number"
              step="1"
              min="1"
              required
              value={budgetForm.amount}
              onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
              placeholder="e.g. 2000"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Period
            </label>
            <select
              value={budgetForm.period}
              onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingBudget ? 'Update Limit' : 'Save Limit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Savings Goal Modal */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title={savingsGoal ? 'Update Savings Goal' : 'Create Savings Goal'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Goal Name
            </label>
            <input
              type="text"
              required
              value={goalForm.title}
              onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Amount (₹)
              </label>
              <input
                type="number"
                required
                min="1"
                value={goalForm.target_amount}
                onChange={(e) => setGoalForm({ ...goalForm, target_amount: e.target.value })}
                placeholder="8000"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Already Saved (₹)
              </label>
              <input
                type="number"
                min="0"
                value={goalForm.current_amount}
                onChange={(e) => setGoalForm({ ...goalForm, current_amount: e.target.value })}
                placeholder="2000"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Target Date (Optional)
            </label>
            <input
              type="date"
              value={goalForm.target_date}
              onChange={(e) => setGoalForm({ ...goalForm, target_date: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsGoalModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budgets;
