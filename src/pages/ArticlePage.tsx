// ============================================================
// ARTICLE PAGE - EDITORIAL READING EXPERIENCE
// ============================================================

import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, Tag, TrendingUp } from 'lucide-react';
import { CATEGORIES, getArticleBySlug } from '../data/articles';
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
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', article.excerpt);

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
      document.title = 'NewsFlow — News & Media Platform';
    };
  }, [article]);

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">Article Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The article you're looking for doesn't exist.</p>
        <Link to="/" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">← Back to Home</Link>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.slug === article.category);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        {/* Category Badge */}
        {category && (
          <Link
            to={`/category/${category.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6 transition-all hover:scale-105"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            <span className="text-lg">{category.icon}</span>
            {category.name}
          </Link>
        )}

        {/* Breaking Badge */}
        {article.isBreaking && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-4 ml-2">
            <TrendingUp className="w-4 h-4" />
            Breaking News
          </div>
        )}

        {/* Headline */}
        <h1 className="headline-display text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-tight mb-6 text-balance">
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <p className="text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
            {article.subtitle}
          </p>
        )}

        {/* Author & Meta */}
        <div className="flex flex-wrap items-center gap-6 pb-8 border-b-2 border-slate-200 dark:border-slate-700">
          <Link to={`/author/${article.authorId}`} className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {article.author.avatar}
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {article.author.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{article.author.role}</p>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime} min read
            </span>
            <span className="text-xs">{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </motion.header>

      {/* Featured Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>
        {article.imageCaption && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 italic text-center">
            {article.imageCaption}
          </p>
        )}
      </motion.div>

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="prose-editorial mb-12"
      >
        {article.content.map((paragraph, i) => (
          <p key={i} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-12 pb-12 border-b border-slate-200 dark:border-slate-700">
          <Tag className="w-5 h-5 text-slate-400" />
          {article.tags.map(tag => (
            <Link
              key={tag}
              to={`/tag/${tag}`}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Share & Bookmark */}
      <div className="flex items-center gap-4 mb-16">
        <button className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Bookmark className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* Author Bio */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 mb-16 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-xl">
            {article.author.avatar}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{article.author.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">{article.author.role}</p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{article.author.bio}</p>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <section>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 headline-editorial">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.find(c => c.slug === article.category) && (
            <>
              {/* Get related articles from same category */}
            </>
          )}
        </div>
      </section>
    </article>
  );
}
