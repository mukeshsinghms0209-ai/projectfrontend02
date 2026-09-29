import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import authService from '../services/authService';
import { User, Mail, Lock, Shield, Sparkles, Check, AlertCircle } from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useExpenses();

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const avatarPresets = [
    'Alex',
    'Jordan',
    'Sam',
    'Riley',
    'Taylor',
    'Morgan'
  ];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authService.updateProfile({
        name: name.trim(),
        avatar_url: avatarUrl
      });
      updateUser(res.data.user);
      showToast('Profile information updated successfully! ✨', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please provide your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.updateProfile({
        currentPassword,
        newPassword
      });
      showToast('Password changed successfully! 🔐', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Incorrect current password or update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
          <User className="w-6 h-6 text-indigo-400" />
          <span>My Profile & Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Personalize your account details and update your security settings.
        </p>
      </div>

      {/* Profile Info & Avatar Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <span>Personal Details</span>
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Avatar preview and presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Your Avatar
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${name || 'Alex'}`}
                alt="Selected avatar"
                className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-indigo-500 object-cover shadow-lg shadow-indigo-500/20"
              />

              <div className="flex flex-wrap gap-2">
                {avatarPresets.map((seed) => {
                  const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
                  const isSelected = avatarUrl === url;
                  return (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`p-1 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/20 scale-105'
                          : 'border-slate-700 bg-slate-800/80 hover:border-slate-500'
                      }`}
                    >
                      <img src={url} alt={seed} className="w-10 h-10 rounded-lg" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-xl text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Card (Section 46) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Change Password</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Passwords are securely hashed using bcrypt with salt rounds.
          </p>
        </div>

        {passwordError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                New Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
