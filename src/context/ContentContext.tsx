// ============================================================
// CONTENT MANAGEMENT CONTEXT - Connected to Backend Service
// ============================================================

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Article, ArticleStatus, ContentFilters, CategorySlug, AnalyticsData } from '../types';
import { ContentService, API } from '../backend';
import { useAuth } from './AuthContext';

interface ContentContextType {
  articles: Article[];
  publishedArticles: Article[];
  filteredArticles: Article[];
  filters: ContentFilters;
  analytics: AnalyticsData;
  setFilters: (f: Partial<ContentFilters>) => void;
  createArticle: (data: Partial<Article>) => { success: boolean; article?: Article; error?: string };
  updateArticle: (id: string, data: Partial<Article>) => { success: boolean; error?: string };
  changeStatus: (id: string, status: ArticleStatus) => { success: boolean; error?: string };
  deleteArticle: (id: string) => { success: boolean; error?: string };
  incrementView: (id: string) => void;
  refreshArticles: () => void;
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
  const [articles, setArticles] = useState<Article[]>(() => ContentService.getAllArticles());
  const [filters, setFiltersState] = useState<ContentFilters>(DEFAULT_FILTERS);

  const refreshArticles = useCallback(() => {
    setArticles(ContentService.getAllArticles());
  }, []);

  const publishedArticles = useMemo(() => 
    articles.filter(a => a.status === 'published'), 
    [articles]
  );

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
      viewsByCategory: Array.from(categoryViews.entries())
        .map(([category, views]) => ({ category, views }))
        .filter(c => c.views > 0),
      recentActivity: [
        { action: 'Article published', timestamp: '2026-01-15T09:30:00Z', user: 'Emma Editor' },
        { action: 'Article created', timestamp: '2026-01-15T10:00:00Z', user: 'Dr. Robert Park' },
        { action: 'Article submitted for review', timestamp: '2026-01-15T09:00:00Z', user: 'Alex Rivera' },
        { action: 'Article updated', timestamp: '2026-01-14T16:20:00Z', user: 'Dr. Emily Watson' },
        { action: 'User login', timestamp: '2026-01-14T14:00:00Z', user: 'Alex Admin' },
      ],
    };
  }, [articles]);

  const setFilters = useCallback((f: Partial<ContentFilters>) => {
    setFiltersState(prev => ({ ...prev, ...f }));
  }, []);

  const createArticle = useCallback((data: Partial<Article>) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const result = ContentService.createArticle(data, user.id, user.name);
    if (result.success) {
      setArticles(ContentService.getAllArticles());
    }
    return result;
  }, [user]);

  const updateArticle = useCallback((id: string, data: Partial<Article>) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const result = ContentService.updateArticle(id, data, user.id, user.name);
    if (result.success) {
      setArticles(ContentService.getAllArticles());
    }
    return result;
  }, [user]);

  const changeStatus = useCallback((id: string, status: ArticleStatus) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const result = ContentService.changeStatus(id, status, user.id, user.name);
    if (result.success) {
      setArticles(ContentService.getAllArticles());
    }
    return result;
  }, [user]);

  const deleteArticle = useCallback((id: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const result = ContentService.deleteArticle(id, user.id, user.name);
    if (result.success) {
      setArticles(ContentService.getAllArticles());
    }
    return result;
  }, [user]);

  const incrementView = useCallback((id: string) => {
    ContentService.incrementView(id);
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
      refreshArticles,
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
