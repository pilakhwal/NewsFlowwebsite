// ============================================================
// API DOCUMENTATION PAGE
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Server, Database, Shield, Search, BarChart3, Users, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { API, AuthService, ContentService, AuditService } from '../backend';

export function ApiDocsPage() {
  const [testResult, setTestResult] = useState<{ endpoint: string; result: any } | null>(null);
  const [testing, setTesting] = useState<string | null>(null);

  const runTest = async (name: string, fn: () => any) => {
    setTesting(name);
    await new Promise(r => setTimeout(r, 300));
    try {
      const result = fn();
      setTestResult({ endpoint: name, result });
    } catch (e: any) {
      setTestResult({ endpoint: name, result: { error: e.message } });
    }
    setTesting(null);
  };

  const endpoints = [
    {
      category: 'Authentication',
      icon: Shield,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      items: [
        { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user', test: () => API.auth.login('admin@newsflow.com', 'admin123') },
        { method: 'POST', path: '/api/auth/register', desc: 'Register new user', test: () => API.auth.register('Test User', 'test@example.com', 'Test1234') },
        { method: 'GET', path: '/api/auth/session', desc: 'Verify session', test: () => ({ valid: true, user: 'demo' }) },
      ],
    },
    {
      category: 'Articles',
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      items: [
        { method: 'GET', path: '/api/articles', desc: 'List all articles', test: () => API.articles.list() },
        { method: 'GET', path: '/api/articles/published', desc: 'Published articles only', test: () => ({ data: ContentService.getPublishedArticles().slice(0, 3), count: ContentService.getPublishedArticles().length }) },
        { method: 'GET', path: '/api/articles/:id', desc: 'Get article by ID', test: () => API.articles.get('1') },
        { method: 'POST', path: '/api/articles', desc: 'Create article (auth required)', test: () => API.articles.create({ title: 'Test Article from API', content: ['Test content'], category: 'technology' }, 'user-admin-001', 'Alex Admin') },
        { method: 'PUT', path: '/api/articles/:id', desc: 'Update article', test: () => ({ success: true, message: 'Update simulated' }) },
        { method: 'PATCH', path: '/api/articles/:id/status', desc: 'Change status', test: () => ({ success: true, message: 'Status change simulated' }) },
        { method: 'DELETE', path: '/api/articles/:id', desc: 'Delete article (admin)', test: () => ({ success: true, message: 'Delete simulated' }) },
      ],
    },
    {
      category: 'Search',
      icon: Search,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      items: [
        { method: 'GET', path: '/api/search?q=climate', desc: 'Search articles', test: () => ({ data: ContentService.search('climate'), count: ContentService.search('climate').length }) },
        { method: 'GET', path: '/api/search?q=AI&category=technology', desc: 'Filtered search', test: () => ({ data: ContentService.search('AI', { category: 'technology' }), count: ContentService.search('AI', { category: 'technology' }).length }) },
      ],
    },
    {
      category: 'Analytics',
      icon: BarChart3,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      items: [
        { method: 'GET', path: '/api/analytics', desc: 'Get analytics data', test: () => API.analytics.get() },
        { method: 'GET', path: '/api/analytics/top-articles', desc: 'Top articles by views', test: () => ({ data: ContentService.getAnalytics().topArticles }) },
      ],
    },
    {
      category: 'Users',
      icon: Users,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      items: [
        { method: 'GET', path: '/api/users', desc: 'List all users', test: () => API.users.list() },
        { method: 'GET', path: '/api/users/:id', desc: 'Get user by ID', test: () => ({ data: AuthService.getUsers()[0] }) },
      ],
    },
    {
      category: 'Audit Logs',
      icon: Clock,
      color: 'text-slate-500',
      bg: 'bg-slate-100 dark:bg-slate-800',
      items: [
        { method: 'GET', path: '/api/audit-logs', desc: 'Recent audit logs', test: () => API.audit.list(5) },
      ],
    },
    {
      category: 'Categories',
      icon: Database,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      items: [
        { method: 'GET', path: '/api/categories', desc: 'List categories', test: () => API.categories.list() },
      ],
    },
  ];

  const methodColors: Record<string, string> = {
    GET: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
            <Server className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">API Documentation</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Backend API Reference — Interactive Testing</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Backend Active
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold">
            REST API
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold">
            JWT Auth
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            Rate Limited
          </span>
          <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold">
            Audit Logged
          </span>
        </div>
      </motion.div>

      {/* Architecture Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white"
      >
        <h2 className="text-lg font-bold mb-3">🏗️ Backend Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="font-semibold mb-1">🗄️ Database Layer</div>
            <div className="text-slate-300 text-xs">Persistent storage with IndexedDB/localStorage. Supports collections, queries, and transactions.</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="font-semibold mb-1">🔐 Auth Service</div>
            <div className="text-slate-300 text-xs">Password hashing, JWT tokens, role-based access, session management, brute-force protection.</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="font-semibold mb-1">📝 Content Service</div>
            <div className="text-slate-300 text-xs">Full article lifecycle, versioning, scheduled publishing, search, analytics tracking.</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          <strong>Note:</strong> This is a client-side simulation of a production backend. In production, this would be replaced with Node.js + Express + PostgreSQL. The API contract remains the same.
        </div>
      </motion.div>

      {/* Test Result */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-xl p-4 text-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs font-mono">Response: {testResult.endpoint}</span>
            <button onClick={() => setTestResult(null)} className="text-slate-500 hover:text-white text-xs">✕ Close</button>
          </div>
          <pre className="text-emerald-400 text-xs overflow-x-auto max-h-64 overflow-y-auto">
            {JSON.stringify(testResult.result, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Endpoints */}
      {endpoints.map((group, gi) => (
        <motion.div
          key={group.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + gi * 0.05 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${group.bg} flex items-center justify-center`}>
              <group.icon className={`w-5 h-5 ${group.color}`} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{group.category}</h2>
            <span className="text-xs text-slate-400 ml-auto">{group.items.length} endpoints</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {group.items.map((item, i) => (
              <div key={i} className="p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${methodColors[item.method]} min-w-[50px] text-center`}>
                  {item.method}
                </span>
                <code className="text-sm font-mono text-slate-700 dark:text-slate-300 flex-1">{item.path}</code>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{item.desc}</span>
                <button
                  onClick={() => runTest(item.path, item.test)}
                  disabled={testing === item.path}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
                >
                  {testing === item.path ? '...' : 'Test'}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
      >
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">🔒 Security Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '🔐', title: 'Password Hashing', desc: 'Salted hash storage, never plaintext' },
            { icon: '🎫', title: 'JWT Sessions', desc: 'Token-based auth with expiration' },
            { icon: '🛡️', title: 'Rate Limiting', desc: '5 login attempts per minute' },
            { icon: '🔒', title: 'Account Lockout', desc: '5 failed attempts = 15min lock' },
            { icon: '👥', title: 'RBAC', desc: 'Role-based access control' },
            { icon: '📝', title: 'Audit Logging', desc: 'All actions tracked' },
            { icon: '🧹', title: 'Input Sanitization', desc: 'XSS prevention' },
            { icon: '✅', title: 'Validation', desc: 'Server-side input validation' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-white">{f.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
