// ============================================================
// ARTICLE PAGE - FULL ARTICLE VIEW
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark, Tag } from 'lucide-react';
import { ARTICLES, CATEGORIES, getArticleBySlug } from '../data/articles';
import { ArticleCard } from '../components/ArticleCard';
import { formatDate, formatTimeAgo } from '../utils/helpers';
import { useEffect } from 'react';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  // SEO metadata
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | NewsFlow`;
      
      // Meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', article.excerpt);

      // Open Graph
      const ogTags: Record<string, string> = {
        'og:title': article.title,
        'og:description': article.excerpt,
        'og:image': article.imageUrl,
        'og:type': 'article',
        'article:published_time': article.publishedAt || '',
        'article:author': article.author.name,
        'article:section': article.category,
      };
      Object.entries(ogTags).forEach(([prop, content]) => {
        if (!content) return;
        let tag = document.querySelector(`meta[property="${prop}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', prop);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });
    }
    return () => {
      document.title = 'NewsFlow — Your Daily News Source';
    };
  }, [article]);

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Article Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-4">The article you're looking for doesn't exist.</p>
        <Link to="/" className="text-red-500 hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.slug === article.category);
  const relatedArticles = ARTICLES.filter(a => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {category && (
          <Link
            to={`/category/${category.slug}`}
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.icon} {category.name}
          </Link>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
          {article.title}
        </h1>
        {article.subtitle && (
          <p className="text-xl text-slate-600 dark:text-slate-300 font-medium mb-4">{article.subtitle}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 pb-6 border-b border-slate-200 dark:border-slate-700">
          <Link to={`/author/${article.authorId}`} className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {article.author.avatar}
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">{article.author.name}</span>
          </Link>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.readTime} min read</span>
          <span className="text-xs">{formatTimeAgo(article.publishedAt)}</span>
        </div>
      </motion.header>

      {/* Featured Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="rounded-2xl overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>
        {article.imageCaption && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic">{article.imageCaption}</p>
        )}
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="prose prose-lg dark:prose-invert max-w-none mb-8"
      >
        {article.content.map((paragraph, i) => (
          <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-lg">
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
          <Tag className="w-4 h-4 text-slate-400" />
          {article.tags.map(tag => (
            <Link
              key={tag}
              to={`/tag/${tag}`}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Share & Bookmark */}
      <div className="flex items-center gap-4 mb-12">
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
          <Bookmark className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* Author Bio */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-12">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {article.author.avatar}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">{article.author.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{article.author.role}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Experienced journalist covering {category?.name.toLowerCase() || 'news'} with a focus on in-depth analysis and investigative reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
