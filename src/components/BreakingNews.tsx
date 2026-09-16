// ============================================================
// BREAKING NEWS TICKER - ENHANCED DESIGN
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
    <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl shadow-lg shadow-brand-500/20 overflow-hidden">
      <div className="px-4 sm:px-6">
        <div className="flex items-center gap-4 h-12 overflow-hidden">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Breaking</span>
          </div>
          <div className="h-6 w-px bg-white/30 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="flex gap-12 whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
              {[...breakingArticles, ...breakingArticles].map((article, i) => (
                <Link
                  key={`${article.id}-${i}`}
                  to={`/article/${article.slug}`}
                  className="text-sm font-semibold hover:underline inline-block"
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
