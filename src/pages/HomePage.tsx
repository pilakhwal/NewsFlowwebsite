// ============================================================
// HOME PAGE
// ============================================================

import { ARTICLES, CATEGORIES } from '../data/articles';
import { HeroArticle } from '../components/HeroArticle';
import { ArticleCard } from '../components/ArticleCard';
import { BreakingNews } from '../components/BreakingNews';
import { TrendingSidebar } from '../components/TrendingSidebar';
import { Newsletter } from '../components/Newsletter';
import { Link } from 'react-router-dom';

export function HomePage() {
  const featuredArticle = ARTICLES.find(a => a.isFeatured && a.isBreaking) || ARTICLES[0];
  const featuredArticles = ARTICLES.filter(a => a.isFeatured && a.id !== featuredArticle.id);
  const latestArticles = ARTICLES.filter(a => !a.isFeatured).slice(0, 6);
  const breakingArticles = ARTICLES.filter(a => a.isBreaking);

  return (
    <div className="space-y-12">
      {/* Breaking News Ticker */}
      <BreakingNews articles={breakingArticles} />

      {/* Hero Article */}
      <section>
        <HeroArticle article={featuredArticle} />
      </section>

      {/* Featured Articles Grid */}
      {featuredArticles.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Featured Stories</h2>
            <Link to="/category/technology" className="text-sm text-red-500 hover:underline font-medium">
              View all →
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Latest News</h2>
          <div className="space-y-6">
            {latestArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" index={i} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TrendingSidebar articles={ARTICLES} />
          <Newsletter />
        </div>
      </div>

      {/* Category Sections */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-red-500 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {ARTICLES.filter(a => a.category === cat.slug).length} articles
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
