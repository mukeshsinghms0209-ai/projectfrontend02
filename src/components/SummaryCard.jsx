import React from 'react';

export const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = 'indigo',
  gradient = 'from-slate-850 to-slate-900',
  borderColor = 'border-slate-800'
}) => {
  const badgeStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  };

  const iconGradients = {
    indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/25',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/25',
    rose: 'from-rose-500 to-pink-600 shadow-rose-500/25',
    amber: 'from-amber-500 to-orange-600 shadow-amber-500/25',
    purple: 'from-purple-500 to-indigo-600 shadow-purple-500/25',
    cyan: 'from-cyan-500 to-blue-600 shadow-cyan-500/25'
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-slate-900/90 border ${borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${iconGradients[badgeColor] || iconGradients.indigo} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
        <span className="text-slate-400 truncate max-w-[70%]">
          {subtitle}
        </span>
        {badgeText && (
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badgeStyles[badgeColor] || badgeStyles.indigo}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
