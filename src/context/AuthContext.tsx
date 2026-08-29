import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isApplicant: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    full_name: string;
    email: string;
    phone: string;
    username?: string;
    password: string;
    confirm_password: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    full_name?: string;
    email?: string;
    phone?: string;
    username?: string;
    current_password?: string;
    new_password?: string;
  }) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('deva_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session on startup
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('deva_auth_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Session expired or invalid, logging out.');
          localStorage.removeItem('deva_auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ identifier, password });
      localStorage.setItem('deva_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    full_name: string;
    email: string;
    phone: string;
    username?: string;
    password: string;
    confirm_password: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('deva_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('deva_auth_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: {
    full_name?: string;
    username?: string;
    email?: string;
    phone?: string;
    current_password?: string;
    new_password?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.updateProfile(data);
      if (res.token) {
        localStorage.setItem('deva_auth_token', res.token);
        setToken(res.token);
      }
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    const res = await api.forgotPassword(email);
    return res.message;
  };

  const isAdmin = user?.role === 'admin';
  const isApplicant = user?.role === 'applicant';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isApplicant,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
