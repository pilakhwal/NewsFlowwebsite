// ============================================================
// NEWS WEBSITE - MAIN APPLICATION
// ============================================================

import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { SearchPage } from './pages/SearchPage';
import { AuthorPage } from './pages/AuthorPage';
import { TagPage } from './pages/TagPage';
import { AdminLoginPage } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminArticlesList } from './pages/admin/AdminArticlesList';
import { AdminArticleEditor } from './pages/admin/AdminArticleEditor';
import { TestPage } from './pages/TestPage';

function PublicLayout() {
  return (
    <ContentProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/author/:id" element={<AuthorPage />} />
              <Route path="/tag/:tag" element={<TagPage />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

function SubscribePage() {
  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Subscribe to NewsFlow</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Get the best news delivered to your inbox every day.</p>
      <form className="flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button type="submit" className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
          Subscribe
        </button>
      </form>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-slate-300 dark:text-slate-700 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
      <a href="#/" className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
        Go Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticlesList />} />
              <Route path="articles/new" element={<AdminArticleEditor />} />
              <Route path="articles/:id/edit" element={<AdminArticleEditor />} />
              <Route path="analytics" element={<div className="text-center py-20"><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h1><p className="text-slate-500 dark:text-slate-400 mt-2">Coming soon</p></div>} />
              <Route path="settings" element={<div className="text-center py-20"><h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1><p className="text-slate-500 dark:text-slate-400 mt-2">Coming soon</p></div>} />
            </Route>
            
            {/* Public Routes */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}
