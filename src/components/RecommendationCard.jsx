import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle2, Info } from 'lucide-react';

export const RecommendationCard = ({ recommendation }) => {
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      badge: 'Warning',
      badgeStyle: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    tip: {
      icon: Lightbulb,
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      badge: 'Smart Tip',
      badgeStyle: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      badge: 'Great Job',
      badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    info: {
      icon: Info,
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      badge: 'Insight',
      badgeStyle: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    }
  };

  const currentType = typeConfig[recommendation.type] || typeConfig.info;
  const Icon = currentType.icon;

  return (
    <div
      className={`p-5 rounded-3xl bg-slate-900 border ${currentType.border} shadow-xl hover:shadow-2xl transition-all duration-300 space-y-3 relative overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-2xl ${currentType.bg} border ${currentType.border} flex items-center justify-center flex-shrink-0 ${currentType.text}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
              {recommendation.title}
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">
              {recommendation.category}
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentType.badgeStyle}`}
        >
          {currentType.badge}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
        {recommendation.message}
      </p>

      {recommendation.suggestion && (
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-start space-x-2 text-xs">
          <span className="text-base select-none">💡</span>
          <span className="text-slate-300 font-medium leading-relaxed">
            {recommendation.suggestion}
          </span>
        </div>
      )}
    </div>
  );
};

export default RecommendationCard;
