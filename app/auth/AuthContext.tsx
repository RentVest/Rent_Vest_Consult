'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('dashboard-auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (password: string): boolean => {
    // Simple password check - in production, this should be more secure
    const correctPassword = 'rentvest2025';

    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('dashboard-auth', 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dashboard-auth');
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};
