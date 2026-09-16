// ============================================================
// ARTICLE CARD COMPONENT
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';
import { Article } from '../types';
import { CATEGORIES } from '../data/articles';
import { formatTimeAgo } from '../utils/helpers';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal' | 'compact';
  index?: number;
}

export function ArticleCard({ article, variant = 'default', index = 0 }: ArticleCardProps) {
  const category = CATEGORIES.find(c => c.slug === article.category);

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link to={`/article/${article.slug}`} className="group flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
          <div className="flex-1">
            {category && (
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: category.color }}>
                {category.name}
              </span>
            )}
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-500 transition-colors line-clamp-2 mt-0.5">
              {article.title}
            </h3>
            <span className="text-xs text-slate-400 mt-1">{formatTimeAgo(article.publishedAt)}</span>
          </div>
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link to={`/article/${article.slug}`} className="group flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all">
          <div className="sm:w-64 h-48 sm:h-auto overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-4 flex flex-col justify-center">
            {category && (
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: category.color }}>
                {category.icon} {category.name}
              </span>
            )}
            <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-red-500 transition-colors mt-1 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author.name}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime} min read</span>
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Default vertical card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/article/${article.slug}`} className="group block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          {category && (
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: category.color }}>
              {category.icon} {category.name}
            </span>
          )}
          <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-red-500 transition-colors mt-1.5 line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author.name}</span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
