// ============================================================
// CONTENT MANAGEMENT CONTEXT
// ============================================================

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Article, ArticleStatus, ContentFilters, CategorySlug, AnalyticsData } from '../types';
import { ARTICLES, getPublishedArticles } from '../data/articles';
import { useAuth } from './AuthContext';

interface ContentContextType {
  articles: Article[];
  publishedArticles: Article[];
  filteredArticles: Article[];
  filters: ContentFilters;
  analytics: AnalyticsData;
  setFilters: (f: Partial<ContentFilters>) => void;
  createArticle: (data: Partial<Article>) => Article;
  updateArticle: (id: string, data: Partial<Article>) => void;
  changeStatus: (id: string, status: ArticleStatus) => void;
  deleteArticle: (id: string) => void;
  incrementView: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const DEFAULT_FILTERS: ContentFilters = {
  status: 'all',
  category: 'all',
  author: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [filters, setFiltersState] = useState<ContentFilters>(DEFAULT_FILTERS);

  const publishedArticles = useMemo(() => articles.filter(a => a.status === 'published'), [articles]);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (filters.status !== 'all') {
      result = result.filter(a => a.status === filters.status);
    }
    if (filters.category !== 'all') {
      result = result.filter(a => a.category === filters.category);
    }
    if (filters.author !== 'all') {
      result = result.filter(a => a.authorId === filters.author);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortBy) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'viewCount': cmp = b.viewCount - a.viewCount; break;
        case 'publishedAt': cmp = (b.publishedAt || '').localeCompare(a.publishedAt || ''); break;
        case 'updatedAt': cmp = b.updatedAt.localeCompare(a.updatedAt); break;
        case 'createdAt':
        default: cmp = b.createdAt.localeCompare(a.createdAt); break;
      }
      return filters.sortOrder === 'asc' ? -cmp : cmp;
    });

    return result;
  }, [articles, filters]);

  const analytics = useMemo((): AnalyticsData => {
    const totalViews = articles.reduce((sum, a) => sum + a.viewCount, 0);
    const topArticles = [...articles]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(a => ({ id: a.id, title: a.title, views: a.viewCount }));

    const categoryViews = new Map<string, number>();
    articles.forEach(a => {
      categoryViews.set(a.category, (categoryViews.get(a.category) || 0) + a.viewCount);
    });

    return {
      totalViews,
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      topArticles,
      viewsByCategory: Array.from(categoryViews.entries()).map(([category, views]) => ({ category, views })),
      recentActivity: [
        { action: 'Article published', timestamp: '2026-01-15T09:30:00Z', user: 'Emma Editor' },
        { action: 'Article created', timestamp: '2026-01-15T10:00:00Z', user: 'Dr. Robert Park' },
        { action: 'Article submitted for review', timestamp: '2026-01-15T09:00:00Z', user: 'Alex Rivera' },
        { action: 'Article updated', timestamp: '2026-01-14T16:20:00Z', user: 'Dr. Emily Watson' },
        { action: 'New user registered', timestamp: '2026-01-14T14:00:00Z', user: 'System' },
      ],
    };
  }, [articles]);

  const setFilters = useCallback((f: Partial<ContentFilters>) => {
    setFiltersState(prev => ({ ...prev, ...f }));
  }, []);

  const createArticle = useCallback((data: Partial<Article>): Article => {
    const now = new Date().toISOString();
    const newArticle: Article = {
      id: `article-${Date.now()}`,
      slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'untitled',
      title: data.title || 'Untitled',
      subtitle: data.subtitle || '',
      excerpt: data.excerpt || '',
      content: data.content || [],
      category: data.category || 'world',
      authorId: data.authorId || 'author-1',
      author: data.author || articles[0].author,
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? now : null,
      createdAt: now,
      updatedAt: now,
      readTime: data.readTime || Math.ceil((data.content || []).join(' ').split(/\s+/).length / 200),
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop',
      imageCaption: data.imageCaption,
      tags: data.tags || [],
      isBreaking: data.isBreaking || false,
      isFeatured: data.isFeatured || false,
      viewCount: 0,
      version: 1,
    };
    setArticles(prev => [newArticle, ...prev]);
    return newArticle;
  }, [articles]);

  const updateArticle = useCallback((id: string, data: Partial<Article>) => {
    setArticles(prev => prev.map(a =>
      a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString(), version: a.version + 1 } : a
    ));
  }, []);

  const changeStatus = useCallback((id: string, status: ArticleStatus) => {
    setArticles(prev => prev.map(a => {
      if (a.id !== id) return a;
      const update: Partial<Article> = { status, updatedAt: new Date().toISOString(), version: a.version + 1 };
      if (status === 'published' && !a.publishedAt) {
        update.publishedAt = new Date().toISOString();
      }
      if (status === 'unpublished' || status === 'archived') {
        update.publishedAt = a.publishedAt; // Keep original publish date
      }
      return { ...a, ...update };
    }));
  }, []);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  }, []);

  const incrementView = useCallback((id: string) => {
    setArticles(prev => prev.map(a =>
      a.id === id ? { ...a, viewCount: a.viewCount + 1 } : a
    ));
  }, []);

  return (
    <ContentContext.Provider value={{
      articles,
      publishedArticles,
      filteredArticles,
      filters,
      analytics,
      setFilters,
      createArticle,
      updateArticle,
      changeStatus,
      deleteArticle,
      incrementView,
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextType {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function getStatusLabel(status: ArticleStatus): string {
  const labels: Record<ArticleStatus, string> = {
    draft: 'Draft',
    review: 'In Review',
    approved: 'Approved',
    scheduled: 'Scheduled',
    published: 'Published',
    unpublished: 'Unpublished',
    archived: 'Archived',
  };
  return labels[status];
}

export function getStatusColor(status: ArticleStatus): string {
  const colors: Record<ArticleStatus, string> = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    approved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    scheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    unpublished: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  };
  return colors[status];
}
