import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';

export const CategoryChart = ({ data = [], height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-64 text-center">
        <span className="text-3xl mb-2">📊</span>
        <p className="text-sm font-semibold text-slate-400">No category spending data yet</p>
        <p className="text-xs text-slate-500">Record an expense to see your category donut chart!</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
    percentage: item.percentage,
    color: item.color || '#6366f1'
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-white flex items-center space-x-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
          </p>
          <p className="text-indigo-400 font-bold text-sm">
            {formatCurrency(item.value, true)}
          </p>
          <p className="text-slate-400 text-[11px]">
            {item.percentage}% of total spending
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-xs text-slate-300 font-medium px-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
