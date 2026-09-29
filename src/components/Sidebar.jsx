import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  PiggyBank,
  PieChart,
  Lightbulb,
  User,
  LogOut,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Add Expense', path: '/expenses/add', icon: PlusCircle },
    { name: 'Budgets & Goals', path: '/budgets', icon: PiggyBank },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Recommendations', path: '/recommendations', icon: Lightbulb },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
            <NavLink to="/dashboard" onClick={onClose} className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                💸
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Teen<span className="text-indigo-400">Tracker</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-indigo-400/80">
                  Smart Money App
                </span>
              </div>
            </NavLink>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card / Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold mb-1">
              <span>💡 Daily Money Tip</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Track immediately right after you tap or pay. It takes only 5 seconds!
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
