import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('kwan_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      const storedToken = localStorage.getItem('kwan_admin_token');
      if (storedToken) {
        try {
          const verifiedUser = await api.getAdminMe();
          setUser(verifiedUser);
          setToken(storedToken);
        } catch (err) {
          localStorage.removeItem('kwan_admin_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    verifyAuth();
  }, []);

  const login = (newToken: string, newUser: AdminUser) => {
    localStorage.setItem('kwan_admin_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('kwan_admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
