// ============================================================
// ADMIN LAYOUT
// ============================================================

import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth, getRoleLabel, getRoleColor } from '../../context/AuthContext';
import { ContentProvider } from '../../context/ContentContext';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Newspaper,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

export function AdminLayout() {
  const { user, logout, canPublish, canAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/articles', icon: FileText, label: 'Articles', end: false },
    { to: '/admin/articles/new', icon: Plus, label: 'New Article', end: true, show: canPublish() },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', end: false, show: canAdmin() },
    { to: '/admin/settings', icon: Settings, label: 'Settings', end: false, show: canAdmin() },
  ];

  return (
    <ContentProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                <Newspaper className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800 dark:text-white">CMS</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.filter(item => item.show !== false).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
            <a
              href="#/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 lg:ml-64">
          {/* Top bar */}
          <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 ml-auto">
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}
      </div>
    </ContentProvider>
  );
}
