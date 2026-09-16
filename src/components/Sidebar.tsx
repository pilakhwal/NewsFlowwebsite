// ============================================================
// SIDEBAR NAVIGATION COMPONENT
// ============================================================

import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ListTodo,
  Plus,
  Settings,
  LogOut,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNewTask: () => void;
}

export function Sidebar({ collapsed, onToggle, onNewTask }: SidebarProps) {
  const { user, logout } = useAuth();
  const { stats } = useTasks();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { to: '/tasks', icon: ListTodo, label: 'All Tasks', badge: stats.total },
    { to: '/tasks?status=todo', icon: CheckSquare, label: 'To Do', badge: stats.total - stats.completed - stats.inProgress },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-30 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg text-slate-800 dark:text-white whitespace-nowrap"
            >
              TaskFlow
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(item => {
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to.split('?')[0]);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.badge !== null && item.badge > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* New Task Button */}
      <div className="px-2 pb-2">
        <button
          onClick={onNewTask}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          aria-label="Create new task"
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">New Task</span>}
        </button>
      </div>

      {/* User & Settings */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-2 space-y-1">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm hover:shadow transition-shadow"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
