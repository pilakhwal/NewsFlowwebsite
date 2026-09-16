// ============================================================
// HERO ARTICLE COMPONENT
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, User } from 'lucide-react';
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
      transition={{ duration: 0.5 }}
    >
      <Link to={`/article/${article.slug}`} className="group relative block rounded-2xl overflow-hidden bg-slate-900">
        <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          {article.isBreaking && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-md mb-3">
              Breaking News
            </span>
          )}
          {category && (
            <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-md mb-3 ml-2">
              {category.icon} {category.name}
            </span>
          )}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight group-hover:text-red-300 transition-colors">
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="text-lg md:text-xl text-slate-200 mt-2 font-medium">{article.subtitle}</p>
          )}
          <p className="text-sm md:text-base text-slate-300 mt-3 max-w-3xl line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-300">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.author.name}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.readTime} min read</span>
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
