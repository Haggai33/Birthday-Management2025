import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '../types/auth';
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  getCurrentUser,
  getUserProfile 
} from '../services/firebase/auth';
import type { LoginData, RegisterData } from '../types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        setState(prev => ({ ...prev, user, isLoading: false }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error : new Error('Failed to initialize auth'),
          isLoading: false 
        }));
      }
    };

    initAuth();
  }, []);

  const handleLogin = useCallback(async (data: LoginData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await loginUser(data);
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Failed to login'),
        isLoading: false 
      }));
      throw error;
    }
  }, []);

  const handleRegister = useCallback(async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await registerUser(data);
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Failed to register'),
        isLoading: false 
      }));
      throw error;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await logoutUser();
      setState(prev => ({ ...prev, user: null, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error : new Error('Failed to logout'),
        isLoading: false 
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        clearError
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