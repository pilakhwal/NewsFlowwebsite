// ============================================================
// CATEGORY PAGE
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ARTICLES, CATEGORIES } from '../data/articles';
import { ArticleCard } from '../components/ArticleCard';
import { CategorySlug } from '../types';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find(c => c.slug === slug);
  const articles = ARTICLES.filter(a => a.category === slug);

  if (!category) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Category Not Found</h1>
        <Link to="/" className="text-red-500 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="text-5xl mb-3">{category.icon}</div>
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">{category.name}</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {articles.length} article{articles.length !== 1 ? 's' : ''} in this category
        </p>
      </motion.div>

      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Articles */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500 dark:text-slate-400">No articles in this category yet.</p>
        </div>
      )}
    </div>
  );
}
