// ============================================================
// HERO ARTICLE COMPONENT - EDITORIAL STYLE
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, User, TrendingUp } from 'lucide-react';
import { Article } from '../types';
import { CATEGORIES } from '../data/articles';
import { formatTimeAgo } from '../utils/helpers';

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
  const category = CATEGORIES.find(c => c.slug === article.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <Link to={`/article/${article.slug}`} className="group relative block rounded-2xl overflow-hidden bg-slate-900 card-hover">
        {/* Image */}
        <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-overlay-bottom" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
          {/* Badges */}
          <div className="flex items-center gap-3 mb-4">
            {article.isBreaking && (
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg animate-pulse-soft"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Breaking News
              </motion.span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-md">
                {category.icon} {category.name}
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="headline-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight group-hover:text-brand-300 transition-colors text-balance">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-xl md:text-2xl text-slate-200 mt-4 font-medium leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Excerpt */}
          <p className="text-base md:text-lg text-slate-300 mt-4 max-w-3xl leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {article.author.avatar}
              </div>
              <span className="font-semibold">{article.author.name}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime} min read
            </span>
            <span className="text-slate-400">{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
