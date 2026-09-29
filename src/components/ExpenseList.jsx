import React, { useState, useEffect } from 'react';
import ExpenseCard from './ExpenseCard';
import { SkeletonTable } from './LoadingSpinner';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/validation';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export const ExpenseList = ({
  expenses = [],
  pagination = { page: 1, totalPages: 1, total: 0 },
  loading = false,
  filters = {},
  onFilterChange,
  onPageChange,
  onEditExpense,
  onDeleteExpense,
  onOpenAdd
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFilterChange({ ...filters, search: searchTerm, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCategoryChange = (e) => {
    onFilterChange({ ...filters, category: e.target.value, page: 1 });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sortBy: e.target.value, page: 1 });
  };

  const handleTypeChange = (e) => {
    onFilterChange({ ...filters, is_necessary: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      search: '',
      category: '',
      payment_method: '',
      is_necessary: '',
      sortBy: 'newest',
      page: 1
    });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.payment_method || filters.is_necessary
  );

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses by title or note..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            {/* Category Select */}
            <select
              value={filters.category || ''}
              onChange={handleCategoryChange}
              className="px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>

            {/* Need vs Want */}
            <select
              value={filters.is_necessary !== undefined ? filters.is_necessary : ''}
              onChange={handleTypeChange}
              className="px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              <option value="true">Needs (Essential)</option>
              <option value="false">Wants (Optional)</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy || 'newest'}
              onChange={handleSortChange}
              className="px-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl border border-rose-500/30 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expense List Content */}
      {loading ? (
        <SkeletonTable />
      ) : expenses.length === 0 ? (
        // Empty State (Section 30)
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl">
            {hasActiveFilters ? '🔍' : '🪙'}
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-white">
              {hasActiveFilters ? 'No matching expenses found' : 'No expenses tracked yet'}
            </h3>
            <p className="text-xs text-slate-400">
              {hasActiveFilters
                ? 'Try adjusting your search criteria or clearing filters.'
                : 'Start tracking your first expense to understand where your money goes!'}
            </p>
          </div>

          <div>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onOpenAdd}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Expense</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
          <span>
            Showing page <strong className="text-white">{pagination.page}</strong> of{' '}
            <strong className="text-white">{pagination.totalPages}</strong> ({pagination.total} total)
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
