// ============================================================
// BREAKING NEWS TICKER
// ============================================================

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface BreakingNewsProps {
  articles: Article[];
}

export function BreakingNews({ articles }: BreakingNewsProps) {
  const breakingArticles = articles.filter(a => a.isBreaking);
  if (breakingArticles.length === 0) return null;

  return (
    <div className="bg-red-600 dark:bg-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-10 overflow-hidden">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">Breaking</span>
          </div>
          <div className="h-4 w-px bg-red-400 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {[...breakingArticles, ...breakingArticles].map((article, i) => (
                <Link
                  key={`${article.id}-${i}`}
                  to={`/article/${article.slug}`}
                  className="text-sm font-medium hover:underline inline-block"
                >
                  {article.title}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
