import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { PlusCircle, Flame, Menu, LogOut, User, Bell } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { openQuickAdd } = useExpenses();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Teen';

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger (mobile) & Friendly Teenager Greeting */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
              <span>Hey, {firstName}!</span>
              <span className="text-xl">✨</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Make smart money moves today
            </p>
          </div>
        </div>

        {/* Right: Streak Badge, Quick Add Button, Profile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Streak Badge */}
          <div
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold"
            title="Your daily expense tracking streak!"
          >
            <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
            <span className="hidden xs:inline">Streak:</span>
            <span>Active 🔥</span>
          </div>

          {/* Quick Add Expense Button */}
          <button
            onClick={() => openQuickAdd()}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/50 transition-all focus:outline-none"
              aria-label="User profile options"
            >
              <img
                src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'Alex'}`}
                alt={user?.name || 'Avatar'}
                className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl py-2 z-50 animate-scale-up">
                  <div className="px-4 py-2 border-b border-slate-700/60">
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
