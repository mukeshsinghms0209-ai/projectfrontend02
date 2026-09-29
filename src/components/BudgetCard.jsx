import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { getCategoryMeta } from '../utils/validation';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';

export const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const categoryMeta = getCategoryMeta(budget.category);
  const percentage = Math.min(100, Math.max(0, budget.percentage || 0));
  const rawPercentage = budget.percentage || 0;

  // Visual status indicators
  let statusBadge = {
    label: 'Healthy',
    bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-400'
  };

  if (rawPercentage >= 100) {
    statusBadge = {
      label: 'Exceeded',
      bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse',
      bar: 'bg-gradient-to-r from-rose-500 to-red-600'
    };
  } else if (rawPercentage >= 80) {
    statusBadge = {
      label: 'Near Limit',
      bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      bar: 'bg-gradient-to-r from-amber-500 to-orange-500'
    };
  } else if (rawPercentage >= 60) {
    statusBadge = {
      label: 'Moderate',
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      bar: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    };
  }

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
            style={{ backgroundColor: `${categoryMeta.color}15`, border: `1px solid ${categoryMeta.color}35` }}
          >
            <span>{categoryMeta.icon}</span>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">{budget.category}</h3>
            <span className="text-[11px] text-slate-400 capitalize">{budget.period || 'monthly'} Budget</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge.bg}`}>
            {statusBadge.label}
          </span>
          {onEdit && (
            <button
              onClick={() => onEdit(budget)}
              className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800"
              aria-label="Edit budget"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(budget.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
              aria-label="Delete budget"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Figures */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-slate-400">Spent:</span>
          <span className="font-bold text-white text-sm">
            {formatCurrency(budget.spent || 0)} <span className="text-slate-500 text-xs">/ {formatCurrency(budget.amount)}</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className={`h-full rounded-full transition-all duration-500 ${statusBadge.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 font-medium">
          <span>{rawPercentage}% used</span>
          <span className={budget.remaining < 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
            {budget.remaining < 0
              ? `Exceeded by ${formatCurrency(Math.abs(budget.remaining))}`
              : `${formatCurrency(budget.remaining)} left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
