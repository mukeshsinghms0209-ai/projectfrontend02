import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { formatRelativeDate } from '../utils/dateUtils';
import { getCategoryMeta, getPaymentMeta } from '../utils/validation';
import { Edit2, Trash2, ShieldCheck, Heart } from 'lucide-react';
import Modal from './Modal';

export const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryMeta = getCategoryMeta(expense.category);
  const paymentMeta = getPaymentMeta(expense.payment_method);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(expense.id);
    setIsDeleting(false);
    setShowConfirmDelete(false);
  };

  return (
    <>
      <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 gap-4">
        {/* Left: Category Icon, Title, Description, Date */}
        <div className="flex items-start sm:items-center space-x-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-inner"
            style={{ backgroundColor: `${categoryMeta.color}15`, border: `1px solid ${categoryMeta.color}35` }}
          >
            <span>{categoryMeta.icon}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {expense.title}
              </h4>
              {expense.is_necessary ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Need</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Heart className="w-3 h-3" />
                  <span>Want</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{expense.category}</span>
              <span>•</span>
              <span>{formatRelativeDate(expense.expense_date)}</span>
              <span>•</span>
              <span className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                <span>{paymentMeta.icon}</span>
                <span>{expense.payment_method}</span>
              </span>
            </div>

            {expense.description && (
              <p className="text-xs text-slate-400/90 italic pt-0.5 line-clamp-1">
                "{expense.description}"
              </p>
            )}
          </div>
        </div>

        {/* Right: Amount & Action buttons */}
        <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
          <div className="text-right">
            <span className="text-base sm:text-lg font-black text-white tracking-tight">
              {formatCurrency(expense.amount, true)}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(expense)}
              className="p-2 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800 transition-colors"
              title="Edit expense"
              aria-label="Edit expense"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
              title="Delete expense"
              aria-label="Delete expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (Section 31) */}
      <Modal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Delete Expense?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
            <p className="font-bold mb-1">Are you sure you want to delete this expense?</p>
            <p className="text-xs text-rose-300/80">
              "{expense.title}" — {formatCurrency(expense.amount)}. This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExpenseCard;
