import React, { useState, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/validation';
import { getTodayDateInputString } from '../utils/dateUtils';
import { ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export const ExpenseForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    expense_date: getTodayDateInputString(),
    payment_method: 'UPI',
    description: '',
    is_necessary: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        expense_date: initialData.expense_date ? initialData.expense_date.split('T')[0] : getTodayDateInputString(),
        payment_method: initialData.payment_method || 'UPI',
        description: initialData.description || '',
        is_necessary: initialData.is_necessary !== undefined ? initialData.is_necessary : true
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Please give your expense a title';
    } else if (formData.title.length > 150) {
      errs.title = 'Title cannot exceed 150 characters';
    }

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      errs.amount = 'Please enter a valid amount greater than ₹0';
    }

    if (!formData.category) {
      errs.category = 'Please select a category';
    }

    if (!formData.expense_date) {
      errs.expense_date = 'Please pick a date';
    }

    if (!formData.payment_method) {
      errs.payment_method = 'Please select a payment method';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  const handleQuickAmount = (val) => {
    const current = parseFloat(formData.amount) || 0;
    setFormData({ ...formData, amount: String(current + val) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
          What did you spend on? <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Lunch at school, Boba Tea, Steam Game"
          className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-rose-400 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.title}</span>
          </p>
        )}
      </div>

      {/* Amount + Quick Add Presets */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
          Amount (₹) <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
            ₹
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            className="w-full pl-9 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-lg font-bold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-xs text-rose-400 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.amount}</span>
          </p>
        )}

        {/* Quick Amount presets for Teenagers */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[50, 100, 200, 500].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleQuickAmount(preset)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              +₹{preset}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setFormData({ ...formData, amount: '' })}
            className="px-2 py-1 text-xs text-slate-400 hover:text-rose-400 transition-colors ml-auto"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
          Category <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setFormData({ ...formData, category: cat.name })}
              className={`flex items-center space-x-2 p-2 rounded-xl text-xs font-bold border transition-all ${
                formData.category === cat.name
                  ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="mt-1 text-xs text-rose-400 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.category}</span>
          </p>
        )}
      </div>

      {/* Date & Payment Method Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Expense Date <span className="text-rose-400">*</span>
          </label>
          <input
            type="date"
            value={formData.expense_date}
            onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          />
          {errors.expense_date && (
            <p className="mt-1 text-xs text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.expense_date}</span>
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Payment Method <span className="text-rose-400">*</span>
          </label>
          <select
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method.name} value={method.name}>
                {method.icon} {method.name}
              </option>
            ))}
          </select>
          {errors.payment_method && (
            <p className="mt-1 text-xs text-rose-400 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.payment_method}</span>
            </p>
          )}
        </div>
      </div>

      {/* Need vs Want (Necessary vs Optional) Toggle */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
          Need vs Want Classification
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, is_necessary: true })}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
              formData.is_necessary
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Essential Need (Necessary)</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, is_necessary: false })}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
              !formData.is_necessary
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Fun & Want (Optional)</span>
          </button>
        </div>
      </div>

      {/* Notes / Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
          Optional Notes / Story
        </label>
        <textarea
          rows="2"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g. Split with Rohan, was on 30% sale, birthday gift for mom"
          className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
