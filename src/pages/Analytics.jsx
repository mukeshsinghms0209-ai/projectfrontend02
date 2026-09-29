import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import budgetService from '../services/budgetService';
import { useExpenses } from '../context/ExpenseContext';
import { DailySpendingChart, MonthlySpendingChart, BudgetComparisonChart } from '../components/SpendingChart';
import CategoryChart from '../components/CategoryChart';
import { SkeletonCard } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import { PieChart as PieIcon, BarChart2, TrendingUp, ShieldCheck, Heart, Calendar } from 'lucide-react';

export const Analytics = () => {
  const { refreshKey } = useExpenses();

  const [timeframe, setTimeframe] = useState('this_month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [necessaryData, setNecessaryData] = useState(null);
  const [budgetsData, setBudgetsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const queryParams = {
          timeframe,
          startDate: timeframe === 'custom' ? customStart : undefined,
          endDate: timeframe === 'custom' ? customEnd : undefined
        };

        const [sumRes, catRes, dailyRes, monthRes, necRes, budRes] = await Promise.all([
          analyticsService.getSummary(queryParams),
          analyticsService.getCategoryBreakdown(queryParams),
          analyticsService.getDailySpending(timeframe === 'this_week' ? 7 : 30),
          analyticsService.getMonthlySpending(6),
          analyticsService.getNecessaryVsOptional(queryParams),
          budgetService.getBudgets()
        ]);

        if (isMounted) {
          setSummary(sumRes.data);
          setCategoryData(catRes.data?.breakdown || []);
          setDailyData(dailyRes.data || []);
          setMonthlyData(monthRes.data || []);
          setNecessaryData(necRes.data || null);
          setBudgetsData(budRes.data?.budgets || []);
        }
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, [timeframe, customStart, customEnd, refreshKey]);

  const timeframeOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Last 3 Months', value: 'last_3_months' },
    { label: 'This Year', value: 'this_year' },
    { label: 'Custom Range', value: 'custom' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header & Timeframe Selector Bar */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
              <BarChart2 className="w-6 h-6 text-indigo-400" />
              <span>Spending Analytics & Insights</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Interactive visual charts to understand habits and trends.
            </p>
          </div>

          {/* Timeframe pill selector */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            {timeframeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeframe(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === opt.value
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date range pickers */}
        {timeframe === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
            <span className="font-bold">Select Date Range:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
            />
            <span>to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
            />
          </div>
        )}
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonCard height="h-28" />
            <SkeletonCard height="h-28" />
            <SkeletonCard height="h-28" />
            <SkeletonCard height="h-28" />
          </>
        ) : (
          <>
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Spent</p>
              <p className="text-2xl font-black text-white mt-1">
                {formatCurrency(summary?.totalSpent || 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">{summary?.expenseCount || 0} transactions</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Average</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">
                {formatCurrency(summary?.averageDailySpend || 0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Across selected timeframe</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Top Category</p>
              <p className="text-2xl font-black text-emerald-400 mt-1 truncate">
                {summary?.topCategory || 'None'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatCurrency(summary?.topCategoryAmount || 0)} total
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Largest Expense</p>
              <p className="text-2xl font-black text-amber-400 mt-1 truncate">
                {summary?.largestExpense ? formatCurrency(summary.largestExpense.amount, true) : '₹0'}
              </p>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {summary?.largestExpense?.title || 'No expenses'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Row 1: Category Donut & Needs vs Wants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Spending by Category */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <PieIcon className="w-5 h-5 text-indigo-400" />
              <span>Chart 1: Spending By Category</span>
            </h3>
            <p className="text-xs text-slate-400">Distribution across categories for active timeframe</p>
          </div>
          <CategoryChart data={categoryData} height={300} />
        </div>

        {/* Chart 4: Necessary vs Optional */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Chart 4: Necessary Needs vs Optional Wants</span>
            </h3>
            <p className="text-xs text-slate-400">Essential living vs impulse/entertainment spending</p>
          </div>

          {necessaryData && (
            <div className="space-y-6 pt-2">
              {/* Needs card */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Essential Needs
                  </span>
                  <p className="text-2xl font-black text-white">
                    {formatCurrency(necessaryData.necessary)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400">
                    {necessaryData.necessaryPercentage}%
                  </span>
                  <p className="text-xs text-emerald-400/80">{necessaryData.necessaryCount} items</p>
                </div>
              </div>

              {/* Wants card */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Optional Wants
                  </span>
                  <p className="text-2xl font-black text-white">
                    {formatCurrency(necessaryData.optional)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-amber-400">
                    {necessaryData.optionalPercentage}%
                  </span>
                  <p className="text-xs text-amber-400/80">{necessaryData.optionalCount} items</p>
                </div>
              </div>

              {/* Visual Split Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${necessaryData.necessaryPercentage}%` }}
                  />
                  <div
                    className="bg-amber-500 h-full transition-all duration-500"
                    style={{ width: `${necessaryData.optionalPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span className="text-emerald-400">● Needs ({necessaryData.necessaryPercentage}%)</span>
                  <span className="text-amber-400">● Wants ({necessaryData.optionalPercentage}%)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Daily Spending Line Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Chart 2: Daily Spending Trend</span>
          </h3>
          <p className="text-xs text-slate-400">Time-series daily trajectory</p>
        </div>
        <DailySpendingChart data={dailyData} height={280} />
      </div>

      {/* Row 3: Monthly History & Budget vs Actual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Monthly Spending History */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Chart 3: Monthly Spending History (Past 6 Months)</span>
            </h3>
            <p className="text-xs text-slate-400">Month-on-month expense comparisons</p>
          </div>
          <MonthlySpendingChart data={monthlyData} height={280} />
        </div>

        {/* Chart 5: Budget vs Actual */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-amber-400" />
              <span>Chart 5: Budget vs Actual Spending</span>
            </h3>
            <p className="text-xs text-slate-400">Comparing category spending against configured limits</p>
          </div>
          <BudgetComparisonChart data={budgetsData} height={280} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
