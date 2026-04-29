import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const result = await authService.getCurrentUser();
        if (result.success) {
          setUser(result.user);
        } else {
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth-required events
    const handleAuthRequired = () => {
      setUser(null);
    };

    window.addEventListener('auth-required', handleAuthRequired);

    return () => {
      window.removeEventListener('auth-required', handleAuthRequired);
    };
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (username, email, password) => {
    const result = await authService.register(username, email, password);
    if (result.success) {
      // Auto-login after successful registration
      await login(username, password);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    login,
    logout,
    register,
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
