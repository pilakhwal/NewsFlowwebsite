// ============================================================
// ADMIN AUTHENTICATION CONTEXT
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  canEdit: () => boolean;
  canPublish: () => boolean;
  canAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts for the CMS
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: 'user-1',
    email: 'admin@newsflow.com',
    name: 'Alex Admin',
    role: 'super_admin',
    avatar: 'AA',
    password: 'admin123',
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    email: 'editor@newsflow.com',
    name: 'Emma Editor',
    role: 'editor',
    avatar: 'EE',
    password: 'editor123',
    createdAt: '2020-06-15T00:00:00Z',
  },
  {
    id: 'user-3',
    email: 'author@newsflow.com',
    name: 'Sam Writer',
    role: 'author',
    avatar: 'SW',
    password: 'author123',
    createdAt: '2021-03-20T00:00:00Z',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('newsflow_session');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('newsflow_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) {
      return { success: false, error: 'Invalid email or password' };
    }
    const { password: _, ...userData } = found;
    const sessionUser: User = { ...userData, lastLogin: new Date().toISOString() };
    setUser(sessionUser);
    localStorage.setItem('newsflow_session', JSON.stringify(sessionUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('newsflow_session');
  }, []);

  const canEdit = useCallback(() => {
    if (!user) return false;
    return ['super_admin', 'admin', 'editor', 'author'].includes(user.role);
  }, [user]);

  const canPublish = useCallback(() => {
    if (!user) return false;
    return ['super_admin', 'admin', 'editor'].includes(user.role);
  }, [user]);

  const canAdmin = useCallback(() => {
    if (!user) return false;
    return ['super_admin', 'admin'].includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
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

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    editor: 'Editor',
    author: 'Author',
    contributor: 'Contributor',
  };
  return labels[role];
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    super_admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    editor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    author: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    contributor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };
  return colors[role];
}
