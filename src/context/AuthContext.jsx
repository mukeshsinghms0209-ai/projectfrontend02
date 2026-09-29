import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('teen_tracker_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('teen_tracker_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await authService.getCurrentUser();
          setUser(res.data.user);
          localStorage.setItem('teen_tracker_user', JSON.stringify(res.data.user));
        } catch {
          // Token is invalid/expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('teen_tracker_token');
          localStorage.removeItem('teen_tracker_user');
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { user: loggedInUser, token: receivedToken } = res.data;
    setUser(loggedInUser);
    setToken(receivedToken);
    localStorage.setItem('teen_tracker_token', receivedToken);
    localStorage.setItem('teen_tracker_user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    const { user: registeredUser, token: receivedToken } = res.data;
    setUser(registeredUser);
    setToken(receivedToken);
    localStorage.setItem('teen_tracker_token', receivedToken);
    localStorage.setItem('teen_tracker_user', JSON.stringify(registeredUser));
    return registeredUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('teen_tracker_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
