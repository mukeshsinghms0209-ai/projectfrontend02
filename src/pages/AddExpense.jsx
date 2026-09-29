import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import expenseService from '../services/expenseService';
import ExpenseForm from '../components/ExpenseForm';
import { PlusCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AddExpense = () => {
  const navigate = useNavigate();
  const { triggerRefresh, showToast } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentSuccess, setRecentSuccess] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await expenseService.createExpense(formData);
      triggerRefresh();
      showToast('Expense recorded successfully! 🎉', 'success');
      setRecentSuccess(res.data);
      // Give teenager quick visual gratification before navigating or letting them log another
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to record expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForAnother = () => {
    setRecentSuccess(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <PlusCircle className="w-6 h-6 text-indigo-400" />
            <span>Log an Expense</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Record what you bought in just 5 seconds
          </p>
        </div>
      </div>

      {recentSuccess ? (
        <div className="p-8 text-center rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-5 animate-scale-up">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Expense Recorded!</h3>
            <p className="text-sm text-slate-300">
              "{recentSuccess.title}" for ₹{Number(recentSuccess.amount).toLocaleString()} was added to your records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetForAnother}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              + Log Another Expense
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <ExpenseForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard')}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};

export default AddExpense;
