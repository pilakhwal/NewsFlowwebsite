// ============================================================
// ADMIN ARTICLES LIST
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreVertical, FileText } from 'lucide-react';
import { useContent, getStatusLabel, getStatusColor } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/articles';
import { AUTHORS } from '../../data/authors';
import { formatTimeAgo } from '../../utils/helpers';
import { ArticleStatus, CategorySlug } from '../../types';
import { useState } from 'react';

export function AdminArticlesList() {
  const { filteredArticles, filters, setFilters, deleteArticle, changeStatus } = useContent();
  const { canPublish, canAdmin } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Articles</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{filteredArticles.length} articles</p>
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

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <select
              value={filters.status}
              onChange={e => setFilters({ status: e.target.value as ArticleStatus | 'all' })}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={filters.category}
              onChange={e => setFilters({ category: e.target.value as CategorySlug | 'all' })}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
            </select>
            <select
              value={filters.author}
              onChange={e => setFilters({ author: e.target.value })}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value="all">All Authors</option>
              {AUTHORS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </motion.div>
        )}
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Article</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden lg:table-cell">Author</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase hidden sm:table-cell">Views</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredArticles.map(article => {
                const cat = CATEGORIES.find(c => c.slug === article.category);
                return (
                  <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                          <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-white truncate max-w-xs">{article.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatTimeAgo(article.updatedAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-600 dark:text-slate-400">{cat?.icon} {cat?.name}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-600 dark:text-slate-400">{article.author.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${getStatusColor(article.status)}`}>
                        {getStatusLabel(article.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{article.viewCount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {article.status === 'published' && (
                          <Link
                            to={`/article/${article.slug}`}
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() => setActionMenu(actionMenu === article.id ? null : article.id)}
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {actionMenu === article.id && (
                            <div className="absolute right-0 top-8 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10 py-1">
                              {canPublish() && article.status === 'draft' && (
                                <button
                                  onClick={() => { changeStatus(article.id, 'review'); setActionMenu(null); }}
                                  className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                  Submit for Review
                                </button>
                              )}
                              {canPublish() && article.status === 'review' && (
                                <button
                                  onClick={() => { changeStatus(article.id, 'published'); setActionMenu(null); }}
                                  className="w-full text-left px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                  Publish
                                </button>
                              )}
                              {canPublish() && article.status === 'published' && (
                                <button
                                  onClick={() => { changeStatus(article.id, 'archived'); setActionMenu(null); }}
                                  className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                  Archive
                                </button>
                              )}
                              {canAdmin() && (
                                <button
                                  onClick={() => { if (confirm('Delete this article?')) { deleteArticle(article.id); setActionMenu(null); } }}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No articles found</p>
          </div>
        )}
      </div>
    </div>
  );
}
