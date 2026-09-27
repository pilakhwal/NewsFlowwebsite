// ============================================================
// AUTHENTICATION CONTEXT - Connected to Backend Service
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { AuthService, db } from '../backend';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  canEdit: () => boolean;
  canPublish: () => boolean;
  canAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const sessionData = localStorage.getItem('newsflow_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        if (session && session.id) {
          // Verify session is still valid
          const storedSession = AuthService.getSession(session.id);
          if (storedSession) {
            setUser(session);
          } else {
            localStorage.removeItem('newsflow_session');
          }
        }
      } catch {
        localStorage.removeItem('newsflow_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 500)); // Simulate network
    
    const result = AuthService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('newsflow_session', JSON.stringify(result.user));
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 500));
    
    const result = AuthService.register(name, email, password);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('newsflow_session', JSON.stringify(result.user));
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    if (user) {
      AuthService.logout(user.id);
    }
    setUser(null);
    localStorage.removeItem('newsflow_session');
  }, [user]);

  const canEdit = useCallback(() => user ? AuthService.canEdit(user.role) : false, [user]);
  const canPublish = useCallback(() => user ? AuthService.canPublish(user.role) : false, [user]);
  const canAdmin = useCallback(() => user ? AuthService.canAdmin(user.role) : false, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      canEdit,
      canPublish,
      canAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    editor: 'Editor',
    author: 'Author',
    contributor: 'Contributor',
  };
  return labels[role] || role;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    author: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    contributor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };
  return colors[role] || colors.contributor;
}
