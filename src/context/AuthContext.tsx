import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load persisted session on initial app boot
    const storedUser = localStorage.getItem('bottle_user');
    const storedToken = localStorage.getItem('bottle_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem('bottle_user');
        localStorage.removeItem('bottle_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return false;
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setToken(data.token);

      localStorage.setItem('bottle_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      localStorage.setItem('bottle_token', data.token);
      
      setLoading(false);
      return true;
    } catch (err: any) {
      setError('Network connection error');
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return false;
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      setToken(data.token);

      localStorage.setItem('bottle_user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      localStorage.setItem('bottle_token', data.token);

      setLoading(false);
      return true;
    } catch (err: any) {
      setError('Network connection error');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bottle_user');
    localStorage.removeItem('bottle_token');
  };

  const clearError = () => setError(null);

  const updateProfile = async (name: string, email: string): Promise<boolean> => {
    if (!token) return false;
    setError(null);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || 'Profile update failed');
        return false;
      }

      const updated = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(updated);
      localStorage.setItem('bottle_user', JSON.stringify(updated));
      return true;
    } catch (e) {
      setError('Error connecting to the server');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
