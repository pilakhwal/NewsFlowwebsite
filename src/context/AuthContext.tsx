// ============================================================
// AUTHENTICATION CONTEXT
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { storage } from '../utils/storage';
import { generateId, validateEmail } from '../utils/helpers';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user database (in production this would be server-side)
interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // In production, never store this client-side
  createdAt: string;
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const sessionUser = storage.get<User | null>('session', null);
    if (sessionUser) {
      setState({ user: sessionUser, isAuthenticated: true, isLoading: false });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (password.length < 1) {
      return { success: false, error: 'Password is required' };
    }

    const users = storage.get<StoredUser[]>('users', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'No account found with this email' };
    }

    if (user.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Incorrect password' };
    }

    const sessionUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    storage.set('session', sessionUser);
    setState({ user: sessionUser, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!name.trim()) {
      return { success: false, error: 'Name is required' };
    }

    if (!validateEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    const users = storage.get<StoredUser[]>('users', []);
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser: StoredUser = {
      id: generateId(),
      email: email.toLowerCase(),
      name: name.trim(),
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    storage.set('users', [...users, newUser]);

    const sessionUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };

    storage.set('session', sessionUser);
    setState({ user: sessionUser, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    storage.remove('session');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateProfile = useCallback((name: string) => {
    if (!state.user) return;
    const updatedUser = { ...state.user, name: name.trim() };
    storage.set('session', updatedUser);
    
    const users = storage.get<StoredUser[]>('users', []);
    const updatedUsers = users.map(u => u.id === state.user!.id ? { ...u, name: name.trim() } : u);
    storage.set('users', updatedUsers);
    
    setState(prev => ({ ...prev, user: updatedUser }));
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
