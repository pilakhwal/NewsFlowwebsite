// ============================================================
// SETTINGS PAGE
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Trash2, Download, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { storage } from '../utils/storage';

export function Settings() {
  const { user, updateProfile } = useAuth();
  const { tasks, stats } = useTasks();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      user,
      tasks,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (user) {
      storage.remove(`tasks_${user.id}`);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Profile</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="settings-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Display Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
            {saved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-emerald-600 dark:text-emerald-400"
              >
                ✓ Saved
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Your Data</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Overview of your task data</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <p className="text-xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">In Progress</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{stats.completionRate}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Rate</p>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Data Management</h2>
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
          >
            <Download className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Export Data</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Download all your tasks as JSON</p>
            </div>
          </button>
          <button
            onClick={handleClearData}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Clear All Tasks</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Permanently delete all your tasks</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">About TaskFlow</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          TaskFlow is a production-quality task management application built with React, TypeScript, and Tailwind CSS.
          All data is stored locally in your browser using localStorage.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">React 18</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">TypeScript</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">Tailwind CSS</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">Framer Motion</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">date-fns</span>
        </div>
      </motion.div>
    </div>
  );
}
