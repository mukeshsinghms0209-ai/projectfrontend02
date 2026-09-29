import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import { useExpenses } from '../context/ExpenseContext';
import RecommendationCard from '../components/RecommendationCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import { Lightbulb, Sparkles, Filter, Info } from 'lucide-react';

export const Recommendations = () => {
  const { refreshKey } = useExpenses();
  const [recommendations, setRecommendations] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await analyticsService.getRecommendations();
        if (isMounted) {
          setRecommendations(res.data?.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const filtered = filterType === 'all'
    ? recommendations
    : recommendations.filter(r => r.type === filterType);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
              <Lightbulb className="w-6 h-6 text-indigo-400" />
              <span>Smart Spending Recommendations</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Rule-based intelligent insights to help you build great financial habits.
            </p>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: 'all' },
              { label: 'Warnings', value: 'warning' },
              { label: 'Smart Tips', value: 'tip' },
              { label: 'Victories', value: 'success' },
              { label: 'Insights', value: 'info' }
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setFilterType(t.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterType === t.value
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Friendly Teenager Educational Disclaimer (Section 13) */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start space-x-2 text-xs text-indigo-300">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-400" />
          <p>
            These recommendations are transparent, educational insights calculated directly from your recent expenses and budget ratios. They are designed to help you practice healthy habits and reflect on your money choices!
          </p>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <span className="text-3xl">✨</span>
          <h3 className="text-base font-bold text-white">No suggestions under this filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You're doing great! Keep recording your daily expenses to unlock new insights.
          </p>
          <button
            onClick={() => setFilterType('all')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
          >
            Show All Suggestions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
