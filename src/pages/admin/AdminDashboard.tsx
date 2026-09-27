// ============================================================
// ADMIN DASHBOARD
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Eye, Users, TrendingUp, Plus, Clock, CheckCircle } from 'lucide-react';
import { useContent, getStatusLabel, getStatusColor } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/articles';
import { formatTimeAgo } from '../../utils/helpers';

export function AdminDashboard() {
  const { articles, analytics, filteredArticles } = useContent();
  const { user, canPublish } = useAuth();

  const recentArticles = [...articles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  const stats = [
    { label: 'Total Articles', value: analytics.totalArticles, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Published', value: analytics.publishedArticles, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Drafts', value: analytics.draftArticles, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Total Views', value: analytics.totalViews.toLocaleString(), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name}</p>
        </div>
        {canPublish() && (
          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 dark:text-white">Recent Articles</h2>
            <Link to="/admin/articles" className="text-xs text-red-500 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentArticles.map(article => (
              <Link
                key={article.id}
                to={`/admin/articles/${article.id}/edit`}
                className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusColor(article.status)}`}>
                      {getStatusLabel(article.status)}
                    </span>
                    <span className="text-xs text-slate-400">{formatTimeAgo(article.updatedAt)}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{article.viewCount.toLocaleString()} views</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Articles */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              Top Performing
            </h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {analytics.topArticles.map((article, i) => (
              <div key={article.id} className="flex items-center gap-3 p-4">
                <span className="text-lg font-bold text-slate-300 dark:text-slate-600 w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{article.title}</p>
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{article.views.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Views by Category */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Views by Category</h2>
        <div className="space-y-3">
          {analytics.viewsByCategory
            .sort((a, b) => b.views - a.views)
            .map(item => {
              const cat = CATEGORIES.find(c => c.slug === item.category);
              const maxViews = Math.max(...analytics.viewsByCategory.map(v => v.views));
              const pct = (item.views / maxViews) * 100;
              return (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="text-sm w-24">{cat?.icon} {cat?.name}</span>
                  <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cat?.color || '#6366f1' }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-20 text-right">
                    {item.views.toLocaleString()}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
