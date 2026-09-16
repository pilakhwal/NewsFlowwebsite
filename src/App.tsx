// ============================================================
// TASK MANAGER - MAIN APPLICATION
// ============================================================

import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Notifications } from './components/Notifications';
import { TaskModal } from './components/TaskModal';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { TaskList } from './pages/TaskList';
import { Settings } from './pages/Settings';
import { storage } from './utils/storage';

// ============================================================
// THEME HOOK
// ============================================================

function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = storage.get<string | null>('theme', null);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    storage.set('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return { darkMode, toggleDarkMode: () => setDarkMode(prev => !prev) };
}

// ============================================================
// LAYOUT COMPONENT
// ============================================================

function AppLayout() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <TaskProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onNewTask={() => setShowTaskModal(true)}
          />
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full z-50 lg:hidden"
              >
                <Sidebar
                  collapsed={false}
                  onToggle={() => setMobileMenuOpen(false)}
                  onNewTask={() => { setShowTaskModal(true); setMobileMenuOpen(false); }}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <Header
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <main className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TaskList onNewTask={() => setShowTaskModal(true)} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Task Modal */}
        <TaskModal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} />

        {/* Notifications */}
        <Notifications />
      </div>
    </TaskProvider>
  );
}

// ============================================================
// AUTH ROUTER
// ============================================================

function AuthRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <AppLayout />;
}

// ============================================================
// ROOT APP
// ============================================================

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AuthRouter />
      </AuthProvider>
    </HashRouter>
  );
}
