import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      setError('');
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}