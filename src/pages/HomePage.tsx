// ============================================================
// HOME PAGE - ENHANCED LAYOUT
// ============================================================

import { CATEGORIES } from '../data/articles';
import { useContent } from '../context/ContentContext';
import { HeroArticle } from '../components/HeroArticle';
import { ArticleCard } from '../components/ArticleCard';
import { BreakingNews } from '../components/BreakingNews';
import { TrendingSidebar } from '../components/TrendingSidebar';
import { Newsletter } from '../components/Newsletter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HomePage() {
  const { publishedArticles } = useContent();
  
  const featuredArticle = publishedArticles.find(a => a.isFeatured && a.isBreaking) || publishedArticles[0];
  const featuredArticles = publishedArticles.filter(a => a.isFeatured && a.id !== featuredArticle?.id);
  const latestArticles = publishedArticles.filter(a => !a.isFeatured).slice(0, 6);
  const breakingArticles = publishedArticles.filter(a => a.isBreaking);

  return (
    <div className="space-y-16">
      {/* Breaking News Ticker */}
      <BreakingNews articles={breakingArticles} />

      {/* Hero Article */}
      <section>
        <HeroArticle article={featuredArticle} />
      </section>

      {/* Featured Articles Grid */}
      {featuredArticles.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white headline-editorial">
              Featured Stories
            </h2>
            <Link to="/category/technology" className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-semibold flex items-center gap-1 group">
              View all 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Main Content with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Articles */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 headline-editorial">
            Latest News
          </h2>
          <div className="space-y-6">
            {latestArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" index={i} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <TrendingSidebar articles={publishedArticles} />
          <Newsletter />
        </div>
      </div>

      {/* Category Sections */}
      <section>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8 headline-editorial">
          Explore Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className="group p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all card-hover"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {publishedArticles.filter((a: any) => a.category === cat.slug).length} articles
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
