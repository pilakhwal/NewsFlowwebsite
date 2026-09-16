// ============================================================
// NEWS WEBSITE - TYPE DEFINITIONS
// ============================================================

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
}

export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string[];
  category: CategorySlug;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  imageUrl: string;
  imageCaption?: string;
  tags: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  isOpinion?: boolean;
  relatedArticleIds?: string[];
}

export interface NewsletterState {
  email: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}
