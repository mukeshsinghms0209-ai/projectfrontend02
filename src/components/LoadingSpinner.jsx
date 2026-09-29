import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div
        className={`${sizeClasses[size]} border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && <p className="text-sm font-medium text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
};

export const SkeletonCard = ({ height = 'h-32' }) => (
  <div className={`bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-pulse ${height}`}>
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-slate-700 rounded-xl"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
        <div className="h-3 bg-slate-700/60 rounded w-1/4"></div>
      </div>
    </div>
    <div className="h-7 bg-slate-700 rounded w-1/2"></div>
  </div>
);

export const SkeletonTable = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-16 bg-slate-800/40 rounded-xl border border-slate-700/40 animate-pulse flex items-center px-4 space-x-4">
        <div className="w-10 h-10 bg-slate-700/60 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700/60 rounded w-1/4"></div>
          <div className="h-3 bg-slate-700/40 rounded w-1/6"></div>
        </div>
        <div className="h-5 bg-slate-700/60 rounded w-16"></div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner;
