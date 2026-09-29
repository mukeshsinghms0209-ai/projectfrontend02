import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Modal from './components/Modal';
import ExpenseForm from './components/ExpenseForm';
import expenseService from './services/expenseService';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';

// App Layout with Sidebar, Navbar, Toast & Global QuickAdd Modal
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    isQuickAddOpen,
    editingExpense,
    closeQuickAdd,
    triggerRefresh,
    toast,
    showToast
  } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickAddSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, formData);
        showToast('Expense updated successfully! ✨', 'success');
      } else {
        await expenseService.createExpense(formData);
        showToast('Expense recorded successfully! 🎉', 'success');
      }
      closeQuickAdd();
      triggerRefresh();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Add / Edit Expense Modal */}
      <Modal
        isOpen={isQuickAddOpen}
        onClose={closeQuickAdd}
        title={editingExpense ? 'Edit Expense' : 'Quick Log Expense'}
        maxWidth="max-w-lg"
      >
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleQuickAddSubmit}
          onCancel={closeQuickAdd}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-bold flex items-center space-x-2 animate-bounce-in ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500 text-rose-200'
              : toast.type === 'info'
              ? 'bg-indigo-950/90 border-indigo-500 text-indigo-200'
              : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExpenseProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/expenses/add" element={<AddExpense />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
