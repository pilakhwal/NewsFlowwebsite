// ============================================================
// TRENDING SIDEBAR COMPONENT - ENHANCED DESIGN
// ============================================================

import { Link } from 'react-router-dom';
import { TrendingUp, Eye } from 'lucide-react';
import { Article } from '../types';
import { CATEGORIES } from '../data/articles';
import { formatTimeAgo } from '../utils/helpers';

interface TrendingSidebarProps {
  articles: Article[];
}

export function TrendingSidebar({ articles }: TrendingSidebarProps) {
  const trending = articles.slice(0, 5);

  return (
    <aside className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Trending Now</h2>
      </div>
      <div className="space-y-5">
        {trending.map((article, i) => {
          const category = CATEGORIES.find(c => c.slug === article.category);
          return (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="group flex gap-4"
            >
              <span className="text-3xl font-bold text-slate-200 dark:text-slate-700 group-hover:text-brand-500 transition-colors w-10 flex-shrink-0 leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                {category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: category.color }}>
                    {category.name}
                  </span>
                )}
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug mt-0.5">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.viewCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
