// ============================================================
// HEADER COMPONENT - MAGAZINE STYLE
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Sun, Moon, Newspaper } from 'lucide-react';
import { CATEGORIES } from '../data/articles';
import { useTheme } from '../context/ThemeContext';

export function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-200 dark:border-slate-800">
      {/* Top Bar - Date & Info */}
      <div className="border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{currentDate}</span>
            <div className="hidden md:flex items-center gap-6 text-slate-500 dark:text-slate-400">
              <span className="hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors">
                Subscribe
              </span>
              <span className="hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer transition-colors">
                Sign In
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Logo & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="text-slate-900 dark:text-white">News</span>
                <span className="text-gradient">Flow</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1 font-medium">
                Your Daily News Source
              </p>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
            </button>

            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:text-amber-500 transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
              )}
            </button>

            {/* Subscribe Button */}
            <Link
              to="/subscribe"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <div className="max-w-3xl mx-auto px-4 py-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, authors..."
                  className="w-full pl-14 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-lg"
                  autoFocus
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <nav className="max-w-7xl mx-auto px-4 py-6 space-y-1">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Navigation Bar */}
      <div className="hidden lg:block border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors whitespace-nowrap rounded-lg hover:bg-white dark:hover:bg-slate-800 group"
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
