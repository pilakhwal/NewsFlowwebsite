// ============================================================
// AUTHOR PAGE (PUBLIC)
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Twitter } from 'lucide-react';
import { AUTHORS } from '../data/authors';
import { getArticlesByAuthor } from '../data/articles';
import { ArticleCard } from '../components/ArticleCard';

export function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const author = AUTHORS.find(a => a.id === id);
  const articles = id ? getArticlesByAuthor(id) : [];

  if (!author) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Author Not Found</h1>
        <Link to="/" className="text-red-500 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Author Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8"
      >
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {author.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{author.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{author.role}</p>
            <p className="text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">{author.bio}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Mail className="w-4 h-4" /> {author.email}
              </span>
              {author.socialLinks?.twitter && (
                <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <Twitter className="w-4 h-4" /> {author.socialLinks.twitter}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-3">
              {articles.length} published article{articles.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Articles */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Articles by {author.name}</h2>
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-center py-12">No published articles yet.</p>
        )}
      </div>
    </div>
  );
}
