// ============================================================
// NEWS WEBSITE - COMPREHENSIVE TYPE DEFINITIONS
// ============================================================

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'author' | 'contributor';

export type ArticleStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'unpublished' | 'archived';

export type CategorySlug =
  | 'world'
  | 'politics'
  | 'technology'
  | 'business'
  | 'science'
  | 'health'
  | 'sports'
  | 'entertainment'
  | 'opinion';

export interface Category {
  slug: CategorySlug;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  email: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string[];
  category: CategorySlug;
  authorId: string;
  author: Author;
  status: ArticleStatus;
  publishedAt: string | null;
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: number;
  imageUrl: string;
  imageCaption?: string;
  tags: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  isOpinion?: boolean;
  seoMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
  viewCount: number;
  version: number;
  auditLog?: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  topArticles: { id: string; title: string; views: number }[];
  viewsByCategory: { category: string; views: number }[];
  recentActivity: { action: string; timestamp: string; user: string }[];
}

export interface ContentFilters {
  status: ArticleStatus | 'all';
  category: CategorySlug | 'all';
  author: string | 'all';
  search: string;
  sortBy: 'publishedAt' | 'createdAt' | 'updatedAt' | 'title' | 'viewCount';
  sortOrder: 'asc' | 'desc';
}
