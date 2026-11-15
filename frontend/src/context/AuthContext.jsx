import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('veloop_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, tab: 'login' });
  const { notify } = useNotification();

  // Load user profile on initial mount if token exists
  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      if (response?.data?.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.warn('Failed to fetch user session:', err.message);
      // If token expired, clear it
      if (err.status === 401) {
        localStorage.removeItem('veloop_token');
        setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('veloop_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setAuthModalState({ isOpen: false, tab: 'login' });
      notify.success(response.message || `Welcome back, ${receivedUser.name}!`);
      return receivedUser;
    } catch (err) {
      notify.error(err.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('veloop_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setAuthModalState({ isOpen: false, tab: 'login' });
      notify.success(response.message || 'Account created with bonus wallet credits!');
      return receivedUser;
    } catch (err) {
      notify.error(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('veloop_token');
    setToken(null);
    setUser(null);
    notify.info('You have been signed out from VELOOP Rewards.');
  };

  const refreshProfile = async () => {
    if (!token) return null;
    try {
      const response = await authAPI.getMe();
      if (response?.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
    return null;
  };

  const earnTokens = async () => {
    if (!token) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await authAPI.claimFaucet();
      if (res?.data?.walletBalances) {
        setUser((prev) => ({
          ...prev,
          walletBalances: res.data.walletBalances,
        }));
        notify.success(res.message || 'Daily tokens added to your wallet!');
      }
    } catch (err) {
      notify.error(err.message || 'Could not claim daily reward right now.');
    }
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalState({ isOpen: true, tab });
  };

  const closeAuthModal = () => {
    setAuthModalState({ isOpen: false, tab: 'login' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        authModalState,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        refreshProfile,
        earnTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
