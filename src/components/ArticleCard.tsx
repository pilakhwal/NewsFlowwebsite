// ============================================================
// ARTICLE CARD COMPONENT - MAGAZINE STYLE
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, User, Eye } from 'lucide-react';
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
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link to={`/article/${article.slug}`} className="group flex gap-4 py-4 border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors -mx-2 px-2 rounded-lg">
          <div className="flex-1 min-w-0">
            {category && (
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: category.color }}>
                {category.name}
              </span>
            )}
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-1 line-clamp-2 leading-snug">
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
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
        <Link to={`/article/${article.slug}`} className="group flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden card-hover">
          <div className="sm:w-72 h-48 sm:h-auto overflow-hidden flex-shrink-0">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-5 flex flex-col justify-center">
            {category && (
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: category.color }}>
                {category.icon} {category.name}
              </span>
            )}
            <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-2 line-clamp-2 leading-tight">
              {article.title}
            </h3>
            {article.subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">{article.subtitle}</p>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">{article.excerpt}</p>
            <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {article.author.avatar}
                </div>
                <span className="font-medium">{article.author.name}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime} min
              </span>
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
      <Link to={`/article/${article.slug}`} className="group block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden card-hover">
        <div className="aspect-[16/10] overflow-hidden relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {category && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider rounded-md shadow-sm" style={{ color: category.color }}>
                {category.icon} {category.name}
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-tight">
            {article.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">{article.excerpt}</p>
          <div className="flex items-center gap-3 mt-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {article.author.avatar}
              </div>
              <span className="font-medium">{article.author.name}</span>
            </span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
