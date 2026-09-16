// ============================================================
// HEADER COMPONENT
// ============================================================

import { Moon, Sun, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onMobileMenuToggle: () => void;
  title?: string;
}

export function Header({ darkMode, onToggleDarkMode, onMobileMenuToggle, title }: HeaderProps) {
  const { user } = useAuth();
  const { stats } = useTasks();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        {title && (
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Overdue indicator */}
        {stats.overdue > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Bell className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              {stats.overdue} overdue
            </span>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">
            {user?.name || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
