// ============================================================
// TRENDING SIDEBAR COMPONENT
// ============================================================

import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { Article } from '../types';
import { CATEGORIES } from '../data/articles';
import { formatTimeAgo } from '../utils/helpers';

interface TrendingSidebarProps {
  articles: Article[];
}

export function TrendingSidebar({ articles }: TrendingSidebarProps) {
  const trending = articles.slice(0, 5);

  return (
    <aside className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Trending Now</h2>
      </div>
      <div className="space-y-4">
        {trending.map((article, i) => {
          const category = CATEGORIES.find(c => c.slug === article.category);
          return (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="group flex gap-3"
            >
              <span className="text-2xl font-bold text-slate-200 dark:text-slate-700 group-hover:text-red-500 transition-colors w-8 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                {category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: category.color }}>
                    {category.name}
                  </span>
                )}
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-red-500 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <span className="text-xs text-slate-400 mt-1">{formatTimeAgo(article.publishedAt)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
