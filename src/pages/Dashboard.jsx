import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import analyticsService from '../services/analyticsService';
import expenseService from '../services/expenseService';
import SummaryCard from '../components/SummaryCard';
import ExpenseCard from '../components/ExpenseCard';
import { DailySpendingChart } from '../components/SpendingChart';
import CategoryChart from '../components/CategoryChart';
import RecommendationCard from '../components/RecommendationCard';
import { SkeletonCard, SkeletonTable } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Calendar,
  Flame,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';

export const Dashboard = () => {
  const { refreshKey, openQuickAdd, deleteExpenseWithConfirmation } = useExpenses();

  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [sumRes, catRes, dailyRes, expRes, recRes] = await Promise.all([
          analyticsService.getSummary({ timeframe: 'this_month' }),
          analyticsService.getCategoryBreakdown({ timeframe: 'this_month' }),
          analyticsService.getDailySpending(14),
          expenseService.getExpenses({ limit: 5, sortBy: 'newest' }),
          analyticsService.getRecommendations()
        ]);

        if (isMounted) {
          setSummary(sumRes.data);
          setCategoryData(catRes.data?.breakdown || []);
          setDailyData(dailyRes.data || []);
          setRecentExpenses(expRes.data?.expenses || []);
          setRecommendations(recRes.data?.recommendations || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner: Teen Greeting & Fast Action */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{summary?.streakDays || 1} Day Streak Active!</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Financial Overview This Month
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Track what you spend, see where your money goes, and level up your financial discipline!
            </p>
          </div>

          <button
            onClick={() => openQuickAdd()}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record New Expense</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Grid (Section 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <SummaryCard
              title="Total Spent This Month"
              value={formatCurrency(summary?.totalSpent || 0)}
              subtitle={`${summary?.expenseCount || 0} expenses recorded`}
              icon={TrendingDown}
              badgeText="This Month"
              badgeColor="rose"
              borderColor="border-rose-500/20"
            />

            <SummaryCard
              title="Monthly Budget Limit"
              value={formatCurrency(summary?.monthlyBudget || 0)}
              subtitle="Planned spending ceiling"
              icon={Wallet}
              badgeText="Budget Cap"
              badgeColor="indigo"
              borderColor="border-indigo-500/20"
            />

            <SummaryCard
              title="Remaining Balance"
              value={formatCurrency(summary?.remainingBudget || 0)}
              subtitle={
                summary?.remainingBudget > 0
                  ? 'Safe to spend within budget'
                  : 'Budget ceiling reached'
              }
              icon={PiggyBank}
              badgeText={summary?.remainingBudget > 0 ? 'Surplus' : 'Exceeded'}
              badgeColor={summary?.remainingBudget > 0 ? 'emerald' : 'amber'}
              borderColor={summary?.remainingBudget > 0 ? 'border-emerald-500/20' : 'border-amber-500/20'}
            />

            <SummaryCard
              title="Daily Average"
              value={`${formatCurrency(summary?.averageDailySpend || 0)}/day`}
              subtitle={`Based on ${summary?.timeframe?.days || 30} days`}
              icon={Calendar}
              badgeText="Pacing"
              badgeColor="purple"
              borderColor="border-purple-500/20"
            />
          </>
        )}
      </div>

      {/* Teen Highlights & Needs vs Wants */}
      {!loading && summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Largest Single Expense */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl flex-shrink-0">
              🏷️
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Largest Expense
              </p>
              <p className="text-sm font-bold text-white truncate">
                {summary.largestExpense ? summary.largestExpense.title : 'None yet'}
              </p>
              <p className="text-xs font-semibold text-amber-400">
                {summary.largestExpense ? formatCurrency(summary.largestExpense.amount, true) : '₹0'}
              </p>
            </div>
          </div>

          {/* Most Used Category */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl flex-shrink-0">
              🏆
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Top Spending Category
              </p>
              <p className="text-sm font-bold text-white truncate">
                {summary.topCategory || 'None'}
              </p>
              <p className="text-xs font-semibold text-indigo-400">
                {formatCurrency(summary.topCategoryAmount || 0)} total
              </p>
            </div>
          </div>

          {/* Necessary vs Optional Ratio */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Needs vs Wants</span>
              <span className="text-emerald-400 font-bold">
                {summary.totalSpent > 0
                  ? `${Math.round((summary.necessarySpending / summary.totalSpent) * 100)}% Needs`
                  : '0%'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{formatCurrency(summary.necessarySpending)}</span>
              </div>
              <span className="text-slate-600">/</span>
              <div className="flex items-center space-x-1 text-amber-400 font-semibold">
                <Heart className="w-3.5 h-3.5" />
                <span>{formatCurrency(summary.optionalSpending)}</span>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{
                  width: `${
                    summary.totalSpent > 0
                      ? (summary.necessarySpending / summary.totalSpent) * 100
                      : 50
                  }%`
                }}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{
                  width: `${
                    summary.totalSpent > 0
                      ? (summary.optionalSpending / summary.totalSpent) * 100
                      : 50
                  }%`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics Row: Daily Trend & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Spending Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Daily Spending Trend</h3>
              <p className="text-xs text-slate-400">Past 14 days activity graph</p>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Loading chart...</div>
          ) : (
            <DailySpendingChart data={dailyData} height={260} />
          )}
        </div>

        {/* Category Breakdown Donut */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">By Category</h3>
              <p className="text-xs text-slate-400">Where money went</p>
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">Loading chart...</div>
          ) : (
            <CategoryChart data={categoryData} height={260} />
          )}
        </div>
      </div>

      {/* Recommendations & Recent Expenses Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Smart Recommendations Preview */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>💡 Smart Suggestions</span>
              </h3>
              <p className="text-xs text-slate-400">Tailored habit coaching</p>
            </div>
            <Link
              to="/recommendations"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 2).map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
            {recommendations.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                Log a few more expenses to receive personalized habit suggestions!
              </p>
            )}
          </div>
        </div>

        {/* Recent Expenses List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-400">Latest 5 expenses logged</p>
            </div>
            <Link
              to="/expenses"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View All Expenses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <SkeletonTable />
          ) : recentExpenses.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No transactions yet. Start by logging your first expense!
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onEdit={() => openQuickAdd(expense)}
                  onDelete={deleteExpenseWithConfirmation}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
