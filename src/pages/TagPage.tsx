// ============================================================
// TAG PAGE (PUBLIC)
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag } from 'lucide-react';
import { getArticlesByTag, getAllTags, CATEGORIES } from '../data/articles';
import { ArticleCard } from '../components/ArticleCard';

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const articles = tag ? getArticlesByTag(tag) : [];

  if (!tag) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Tag Not Found</h1>
        <Link to="/" className="text-red-500 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Tag Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-4">
          <Tag className="w-8 h-8 text-indigo-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">#{tag}</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {articles.length} article{articles.length !== 1 ? 's' : ''} tagged with "{tag}"
        </p>
      </motion.div>

      {/* Articles */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400 text-center py-12">No articles found with this tag.</p>
      )}

      {/* Popular Tags */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {getAllTags().slice(0, 20).map(({ tag: t, count }) => (
            <Link
              key={t}
              to={`/tag/${t}`}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                t === tag
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
              }`}
            >
              #{t} <span className="text-xs opacity-70">({count})</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
