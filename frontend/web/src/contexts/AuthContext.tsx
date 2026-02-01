import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('=== LOGIN DEBUG ===');
      console.log('Attempting login for:', email);
      
      const response = await authService.login(email, password);
      console.log('Login API response:', response);
      
      if (response.success && response.data) {
        const token = response.token;
        const userData = response.data.user;
        console.log('Token received:', token ? 'YES' : 'NO');
        console.log('User data received:', userData);
        
        if (userData.role !== 'salon_owner' && userData.role !== 'admin') {
          return { success: false, error: 'Access denied. Only salon owners and admins can access this dashboard.' };
        }

        console.log('Storing token in localStorage...');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Token stored:', localStorage.getItem('token') ? 'YES' : 'NO');
        console.log('User stored:', localStorage.getItem('user') ? 'YES' : 'NO');
        
        setUser(userData);
        console.log('User set in context:', userData.name);
        
        setTimeout(() => {
          toast.success(`Welcome back, ${userData.name}!`);
        }, 100);
        
        console.log('=== LOGIN SUCCESS ===');
        return { success: true };
      } else {
        console.log('Login failed - no data in response');
        return { success: false, error: response.error || 'Invalid credentials' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        return { success: false, error: 'Invalid email or password' };
      } else {
        return { success: false, error: 'Network error. Please check your connection.' };
      }
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};