import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session on mount
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('financeiq_user');
        const storedToken = localStorage.getItem('financeiq_token');
        
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('financeiq_user');
        localStorage.removeItem('financeiq_token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Sign in failed');
        return false;
      }

      // Store session
      localStorage.setItem('financeiq_user', JSON.stringify(data.user));
      localStorage.setItem('financeiq_token', data.user.id);

      setAuthState({
        user: data.user,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Unable to reach authentication server. Please ensure backend is running on port 5000.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedName = name.trim();

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password, name: normalizedName }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Sign up failed');
        return false;
      }

      // Store session
      localStorage.setItem('financeiq_user', JSON.stringify(data.user));
      localStorage.setItem('financeiq_token', data.user.id);

      setAuthState({
        user: data.user,
        isAuthenticated: true,
      });

      alert('Account created successfully!');
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Unable to reach authentication server. Please ensure backend is running on port 5000.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('financeiq_user');
      localStorage.removeItem('financeiq_token');
      setAuthState({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...authState,
    loading,
    signin,
    signup,
    signout,
  };
};