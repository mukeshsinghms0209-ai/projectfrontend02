import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';

/**
 * Daily Spending Line Chart
 */
export const DailySpendingChart = ({ data = [], height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No daily spending recorded in this period.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-300">{payload[0].payload.label || label}</p>
          <p className="text-emerald-400 font-bold text-sm">
            {formatCurrency(payload[0].value, true)}
          </p>
          <p className="text-slate-400 text-[11px]">
            {payload[0].payload.count || 0} transactions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            tickFormatter={(val) => formatCompactCurrency(val)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#0f172a' }}
            activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Monthly Spending Bar Chart
 */
export const MonthlySpendingChart = ({ data = [], height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No monthly spending history available.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-300">{payload[0].payload.month}</p>
          <p className="text-indigo-400 font-bold text-sm">
            {formatCurrency(payload[0].value, true)}
          </p>
          <p className="text-slate-400 text-[11px]">
            {payload[0].payload.count || 0} expenses logged
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            tickFormatter={(val) => formatCompactCurrency(val)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            fill="#6366f1"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Budget vs Actual Bar Chart
 */
export const BudgetComparisonChart = ({ data = [], height = 320 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No budget comparison data found. Create a budget to get started!
      </div>
    );
  }

  const chartData = data.map((b) => ({
    category: b.category,
    Budget: Number(b.amount),
    Spent: Number(b.spent || 0),
    remaining: b.remaining
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1.5">
          <p className="font-bold text-white text-sm">{label}</p>
          <div className="space-y-1">
            <p className="text-slate-400">
              Budget: <strong className="text-indigo-400">{formatCurrency(payload[0]?.value)}</strong>
            </p>
            <p className="text-slate-400">
              Spent: <strong className="text-amber-400">{formatCurrency(payload[1]?.value)}</strong>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="category"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => formatCompactCurrency(val)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="Budget" fill="#6366f1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Spent" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
