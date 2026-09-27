// ============================================================
// BACKEND SIMULATION LAYER
// Production-grade backend patterns implemented client-side
// Can be swapped to real Node.js + PostgreSQL backend
// ============================================================

import { Article, ArticleStatus, User, UserRole, AuditEntry, Category, CategorySlug, AnalyticsData } from '../types';
import { AUTHORS } from '../data/authors';
import { CATEGORIES } from '../data/articles';

// ============================================================
// DATABASE LAYER (IndexedDB-backed persistent storage)
// ============================================================

const DB_PREFIX = 'newsflow_db_';

class Database {
  private memory: Map<string, any> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(DB_PREFIX));
      keys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          this.memory.set(key.replace(DB_PREFIX, ''), JSON.parse(data));
        }
      });
    } catch (e) {
      console.error('DB load error:', e);
    }
  }

  private persist(key: string, value: any): void {
    try {
      localStorage.setItem(DB_PREFIX + key, JSON.stringify(value));
      this.memory.set(key, value);
    } catch (e) {
      console.error('DB persist error:', e);
    }
  }

  get<T>(collection: string, defaultValue: T): T {
    return this.memory.get(collection) ?? defaultValue;
  }

  set<T>(collection: string, value: T): void {
    this.persist(collection, value);
  }

  clear(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(DB_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
    this.memory.clear();
  }
}

export const db = new Database();

// ============================================================
// SECURITY UTILITIES
// ============================================================

// Simple hash (in production, use bcrypt on server)
export function hashPassword(password: string): string {
  let hash = 0;
  const salt = 'newsflow_salt_2026';
  const salted = salt + password + salt;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hashed_' + Math.abs(hash).toString(36) + '_' + salted.length;
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate secure token
export function generateToken(): string {
  return 'tok_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 16);
}

// Generate ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Slug generator
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80);
}

// Input sanitization
export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Email validation
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password strength
export function validatePasswordStrength(password: string): { valid: boolean; score: number; errors: string[] } {
  const errors: string[] = [];
  let score = 0;
  if (password.length >= 8) score++; else errors.push('Min 8 characters');
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++; else errors.push('One uppercase letter');
  if (/[a-z]/.test(password)) score++; else errors.push('One lowercase letter');
  if (/[0-9]/.test(password)) score++; else errors.push('One number');
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return { valid: errors.length === 0, score, errors };
}

// ============================================================
// RATE LIMITER
// ============================================================

class RateLimiter {
  private attempts: Map<string, { count: number; resetAt: number }> = new Map();

  check(key: string, maxAttempts: number, windowMs: number): { allowed: boolean; remaining: number; retryAfter?: number } {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetAt) {
      this.attempts.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    if (record.count >= maxAttempts) {
      return { allowed: false, remaining: 0, retryAfter: Math.ceil((record.resetAt - now) / 1000) };
    }

    record.count++;
    return { allowed: true, remaining: maxAttempts - record.count };
  }
}

export const rateLimiter = new RateLimiter();

// ============================================================
// AUDIT LOG SERVICE
// ============================================================

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  resource: string;
  resourceId: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

export const AuditService = {
  log(action: string, userId: string, userName: string, resource: string, resourceId: string, details?: string): void {
    const logs = db.get<AuditLog[]>('audit_logs', []);
    const entry: AuditLog = {
      id: generateId(),
      action,
      userId,
      userName,
      resource,
      resourceId,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(entry);
    // Keep last 500 entries
    db.set('audit_logs', logs.slice(0, 500));
  },

  getLogs(limit = 50, offset = 0): AuditLog[] {
    const logs = db.get<AuditLog[]>('audit_logs', []);
    return logs.slice(offset, offset + limit);
  },

  getLogsByUser(userId: string): AuditLog[] {
    return db.get<AuditLog[]>('audit_logs', []).filter(l => l.userId === userId);
  },

  getLogsByResource(resource: string, resourceId: string): AuditLog[] {
    return db.get<AuditLog[]>('audit_logs', []).filter(l => l.resource === resource && l.resourceId === resourceId);
  },
};

// ============================================================
// AUTH SERVICE
// ============================================================

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  passwordHash: string;
  createdAt: string;
  lastLogin: string | null;
  isActive: boolean;
  failedAttempts: number;
  lockedUntil: string | null;
}

interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

// Default admin users
function initializeUsers(): void {
  const users = db.get<StoredUser[]>('users', []);
  if (users.length === 0) {
    const defaults: StoredUser[] = [
      {
        id: 'user-admin-001',
        email: 'admin@newsflow.com',
        name: 'Alex Admin',
        role: 'super_admin',
        avatar: 'AA',
        passwordHash: hashPassword('admin123'),
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: null,
        isActive: true,
        failedAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'user-editor-001',
        email: 'editor@newsflow.com',
        name: 'Emma Editor',
        role: 'editor',
        avatar: 'EE',
        passwordHash: hashPassword('editor123'),
        createdAt: '2024-06-15T00:00:00Z',
        lastLogin: null,
        isActive: true,
        failedAttempts: 0,
        lockedUntil: null,
      },
      {
        id: 'user-author-001',
        email: 'author@newsflow.com',
        name: 'Sam Writer',
        role: 'author',
        avatar: 'SW',
        passwordHash: hashPassword('author123'),
        createdAt: '2024-03-20T00:00:00Z',
        lastLogin: null,
        isActive: true,
        failedAttempts: 0,
        lockedUntil: null,
      },
    ];
    db.set('users', defaults);
  }
}

initializeUsers();

export const AuthService = {
  login(email: string, password: string): { success: boolean; user?: User; token?: string; error?: string } {
    // Rate limiting
    const rateCheck = rateLimiter.check(`login_${email}`, 5, 60000);
    if (!rateCheck.allowed) {
      return { success: false, error: `Too many attempts. Try again in ${rateCheck.retryAfter}s` };
    }

    const users = db.get<StoredUser[]>('users', []);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated' };
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return { success: false, error: 'Account is temporarily locked. Try again later.' };
    }

    if (!verifyPassword(password, user.passwordHash)) {
      // Increment failed attempts
      user.failedAttempts++;
      if (user.failedAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
      db.set('users', users);
      return { success: false, error: 'Invalid email or password' };
    }

    // Reset failed attempts
    user.failedAttempts = 0;
    user.lockedUntil = null;
    user.lastLogin = new Date().toISOString();
    db.set('users', users);

    // Create session
    const session: Session = {
      token: generateToken(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    db.set(`session_${user.id}`, session);

    const publicUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin || undefined,
    };

    AuditService.log('user.login', user.id, user.name, 'auth', user.id);

    return { success: true, user: publicUser, token: session.token };
  },

  register(name: string, email: string, password: string, role: UserRole = 'contributor'): { success: boolean; user?: User; error?: string } {
    if (!name.trim()) return { success: false, error: 'Name is required' };
    if (!validateEmail(email)) return { success: false, error: 'Invalid email' };
    
    const strength = validatePasswordStrength(password);
    if (!strength.valid) return { success: false, error: strength.errors.join(', ') };

    const users = db.get<StoredUser[]>('users', []);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: StoredUser = {
      id: 'user-' + generateId(),
      email: email.toLowerCase(),
      name: name.trim(),
      role,
      avatar: name.trim().split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true,
      failedAttempts: 0,
      lockedUntil: null,
    };

    users.push(newUser);
    db.set('users', users);

    AuditService.log('user.register', newUser.id, newUser.name, 'auth', newUser.id);

    const publicUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt,
    };

    return { success: true, user: publicUser };
  },

  logout(userId: string): void {
    db.set(`session_${userId}`, null);
    AuditService.log('user.logout', userId, '', 'auth', userId);
  },

  getSession(userId: string): Session | null {
    const session = db.get<Session | null>(`session_${userId}`, null);
    if (!session) return null;
    if (new Date(session.expiresAt) < new Date()) {
      db.set(`session_${userId}`, null);
      return null;
    }
    return session;
  },

  getUsers(): User[] {
    return db.get<StoredUser[]>('users', []).map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin || undefined,
    }));
  },

  changePassword(userId: string, oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    const users = db.get<StoredUser[]>('users', []);
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };
    if (!verifyPassword(oldPassword, user.passwordHash)) return { success: false, error: 'Current password is incorrect' };
    
    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) return { success: false, error: strength.errors.join(', ') };
    
    user.passwordHash = hashPassword(newPassword);
    db.set('users', users);
    AuditService.log('user.password_change', userId, user.name, 'auth', userId);
    return { success: true };
  },

  // Permission checks
  canEdit(userRole: UserRole): boolean {
    return ['super_admin', 'admin', 'editor', 'author'].includes(userRole);
  },

  canPublish(userRole: UserRole): boolean {
    return ['super_admin', 'admin', 'editor'].includes(userRole);
  },

  canAdmin(userRole: UserRole): boolean {
    return ['super_admin', 'admin'].includes(userRole);
  },

  canManageUsers(userRole: UserRole): boolean {
    return userRole === 'super_admin';
  },
};

// ============================================================
// CONTENT SERVICE
// ============================================================

interface ArticleVersion {
  version: number;
  data: Partial<Article>;
  changedBy: string;
  changedByName: string;
  timestamp: string;
  changeNote?: string;
}

export const ContentService = {
  // Get all articles (for admin)
  getAllArticles(): Article[] {
    return db.get<Article[]>('articles', []);
  },

  // Get published articles only (for public)
  getPublishedArticles(): Article[] {
    return db.get<Article[]>('articles', []).filter(a => a.status === 'published');
  },

  // Get article by ID
  getArticleById(id: string): Article | undefined {
    return db.get<Article[]>('articles', []).find(a => a.id === id);
  },

  // Get article by slug
  getArticleBySlug(slug: string): Article | undefined {
    return db.get<Article[]>('articles', []).find(a => a.slug === slug && a.status === 'published');
  },

  // Create article
  createArticle(data: Partial<Article>, userId: string, userName: string): { success: boolean; article?: Article; error?: string } {
    if (!data.title?.trim()) return { success: false, error: 'Title is required' };
    if (data.title.length > 300) return { success: false, error: 'Title too long (max 300 chars)' };

    const articles = db.get<Article[]>('articles', []);
    const slug = generateSlug(data.title);

    // Check for duplicate slug
    if (articles.some(a => a.slug === slug)) {
      return { success: false, error: 'An article with a similar title already exists' };
    }

    const now = new Date().toISOString();
    const author = AUTHORS.find(a => a.id === data.authorId) || AUTHORS[0];

    const article: Article = {
      id: 'art-' + generateId(),
      slug,
      title: data.title.trim(),
      subtitle: data.subtitle?.trim() || '',
      excerpt: data.excerpt?.trim() || '',
      content: data.content || [],
      category: data.category || 'world',
      authorId: data.authorId || author.id,
      author,
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? now : null,
      scheduledAt: data.scheduledAt || null,
      createdAt: now,
      updatedAt: now,
      readTime: data.readTime || Math.ceil((data.content || []).join(' ').split(/\s+/).length / 200) || 1,
      imageUrl: data.imageUrl || '',
      imageCaption: data.imageCaption || '',
      tags: data.tags || [],
      isBreaking: data.isBreaking || false,
      isFeatured: data.isFeatured || false,
      isOpinion: data.isOpinion || false,
      seoMetadata: data.seoMetadata || {},
      viewCount: 0,
      version: 1,
    };

    articles.unshift(article);
    db.set('articles', articles);

    // Save version
    this.saveVersion(article.id, article, userId, userName, 'Initial creation');

    AuditService.log('article.create', userId, userName, 'article', article.id, `Created: ${article.title}`);

    return { success: true, article };
  },

  // Update article
  updateArticle(id: string, data: Partial<Article>, userId: string, userName: string): { success: boolean; error?: string } {
    const articles = db.get<Article[]>('articles', []);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return { success: false, error: 'Article not found' };

    const article = articles[index];
    const updated = { ...article, ...data, updatedAt: new Date().toISOString(), version: article.version + 1 };

    // Handle status changes
    if (data.status && data.status !== article.status) {
      if (data.status === 'published' && !article.publishedAt) {
        updated.publishedAt = new Date().toISOString();
      }
    }

    // Validate slug uniqueness if changed
    if (data.title && data.title !== article.title) {
      const newSlug = generateSlug(data.title);
      if (articles.some(a => a.slug === newSlug && a.id !== id)) {
        return { success: false, error: 'Slug conflict with existing article' };
      }
      updated.slug = newSlug;
    }

    articles[index] = updated;
    db.set('articles', articles);

    this.saveVersion(id, updated, userId, userName, 'Updated article');
    AuditService.log('article.update', userId, userName, 'article', id, `Updated: ${updated.title}`);

    return { success: true };
  },

  // Change status
  changeStatus(id: string, status: ArticleStatus, userId: string, userName: string): { success: boolean; error?: string } {
    const articles = db.get<Article[]>('articles', []);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return { success: false, error: 'Article not found' };

    const article = articles[index];
    const oldStatus = article.status;

    // Validation
    if (status === 'published') {
      if (!article.title.trim()) return { success: false, error: 'Cannot publish: missing title' };
      if (!article.content.length) return { success: false, error: 'Cannot publish: empty content' };
    }

    article.status = status;
    article.updatedAt = new Date().toISOString();
    article.version++;

    if (status === 'published' && !article.publishedAt) {
      article.publishedAt = new Date().toISOString();
    }

    articles[index] = article;
    db.set('articles', articles);

    AuditService.log('article.status_change', userId, userName, 'article', id, `${oldStatus} → ${status}`);

    return { success: true };
  },

  // Delete article
  deleteArticle(id: string, userId: string, userName: string): { success: boolean; error?: string } {
    const articles = db.get<Article[]>('articles', []);
    const article = articles.find(a => a.id === id);
    if (!article) return { success: false, error: 'Article not found' };

    db.set('articles', articles.filter(a => a.id !== id));
    AuditService.log('article.delete', userId, userName, 'article', id, `Deleted: ${article.title}`);

    return { success: true };
  },

  // Increment view count
  incrementView(id: string): void {
    const articles = db.get<Article[]>('articles', []);
    const article = articles.find(a => a.id === id);
    if (article) {
      article.viewCount++;
      db.set('articles', articles);
    }
  },

  // Version history
  saveVersion(articleId: string, data: Partial<Article>, userId: string, userName: string, note?: string): void {
    const versions = db.get<ArticleVersion[]>(`versions_${articleId}`, []);
    versions.push({
      version: data.version || 1,
      data,
      changedBy: userId,
      changedByName: userName,
      timestamp: new Date().toISOString(),
      changeNote: note,
    });
    db.set(`versions_${articleId}`, versions);
  },

  getVersions(articleId: string): ArticleVersion[] {
    return db.get<ArticleVersion[]>(`versions_${articleId}`, []);
  },

  // Search
  search(query: string, filters?: { category?: CategorySlug; status?: ArticleStatus }): Article[] {
    let articles = db.get<Article[]>('articles', []);
    
    // Only published for public search
    if (!filters?.status) {
      articles = articles.filter(a => a.status === 'published');
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.some(p => p.toLowerCase().includes(q)) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.author.name.toLowerCase().includes(q)
      );
    }

    if (filters?.category) {
      articles = articles.filter(a => a.category === filters.category);
    }
    if (filters?.status) {
      articles = articles.filter(a => a.status === filters.status);
    }

    return articles;
  },

  // Analytics
  getAnalytics(): AnalyticsData {
    const articles = db.get<Article[]>('articles', []);
    const totalViews = articles.reduce((sum, a) => sum + a.viewCount, 0);

    return {
      totalViews,
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      topArticles: [...articles].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5).map(a => ({ id: a.id, title: a.title, views: a.viewCount })),
      viewsByCategory: CATEGORIES.map(c => ({
        category: c.slug,
        views: articles.filter(a => a.category === c.slug).reduce((sum, a) => sum + a.viewCount, 0),
      })).filter(c => c.views > 0),
      recentActivity: AuditService.getLogs(10).map(l => ({
        action: l.action,
        timestamp: l.timestamp,
        user: l.userName,
      })),
    };
  },
};

// ============================================================
// SCHEDULER SERVICE (for scheduled publishing)
// ============================================================

export const SchedulerService = {
  checkScheduledArticles(): void {
    const articles = db.get<Article[]>('articles', []);
    const now = new Date();
    let changed = false;

    articles.forEach(article => {
      if (article.status === 'scheduled' && article.scheduledAt) {
        const scheduledTime = new Date(article.scheduledAt);
        if (scheduledTime <= now) {
          article.status = 'published';
          article.publishedAt = now.toISOString();
          article.updatedAt = now.toISOString();
          changed = true;
          AuditService.log('article.auto_publish', 'system', 'System', 'article', article.id, `Auto-published: ${article.title}`);
        }
      }
    });

    if (changed) {
      db.set('articles', articles);
    }
  },
};

// Run scheduler check on load
SchedulerService.checkScheduledArticles();

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// ============================================================
// API LAYER (simulates REST API)
// ============================================================

export const API = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string): ApiResponse<{ user: User; token: string }> => {
      const result = AuthService.login(email, password);
      if (result.success && result.user && result.token) {
        return { success: true, data: { user: result.user, token: result.token } };
      }
      return { success: false, error: result.error };
    },
    register: (name: string, email: string, password: string): ApiResponse<{ user: User }> => {
      const result = AuthService.register(name, email, password);
      if (result.success && result.user) {
        return { success: true, data: { user: result.user } };
      }
      return { success: false, error: result.error };
    },
  },

  // Articles endpoints
  articles: {
    list: (filters?: { status?: ArticleStatus; category?: CategorySlug; search?: string }): ApiResponse<Article[]> => {
      let articles: Article[];
      if (filters?.search) {
        articles = ContentService.search(filters.search, { category: filters.category, status: filters.status });
      } else {
        articles = ContentService.getAllArticles();
        if (filters?.status) articles = articles.filter(a => a.status === filters.status);
        if (filters?.category) articles = articles.filter(a => a.category === filters.category);
      }
      return { success: true, data: articles, meta: { total: articles.length } };
    },
    get: (id: string): ApiResponse<Article> => {
      const article = ContentService.getArticleById(id);
      if (!article) return { success: false, error: 'Article not found' };
      return { success: true, data: article };
    },
    getBySlug: (slug: string): ApiResponse<Article> => {
      const article = ContentService.getArticleBySlug(slug);
      if (!article) return { success: false, error: 'Article not found' };
      ContentService.incrementView(article.id);
      return { success: true, data: article };
    },
    create: (data: Partial<Article>, userId: string, userName: string): ApiResponse<Article> => {
      const result = ContentService.createArticle(data, userId, userName);
      if (result.success && result.article) {
        return { success: true, data: result.article };
      }
      return { success: false, error: result.error };
    },
    update: (id: string, data: Partial<Article>, userId: string, userName: string): ApiResponse => {
      const result = ContentService.updateArticle(id, data, userId, userName);
      return result;
    },
    delete: (id: string, userId: string, userName: string): ApiResponse => {
      const result = ContentService.deleteArticle(id, userId, userName);
      return result;
    },
    changeStatus: (id: string, status: ArticleStatus, userId: string, userName: string): ApiResponse => {
      const result = ContentService.changeStatus(id, status, userId, userName);
      return result;
    },
  },

  // Analytics
  analytics: {
    get: (): ApiResponse<AnalyticsData> => {
      return { success: true, data: ContentService.getAnalytics() };
    },
  },

  // Audit logs
  audit: {
    list: (limit = 50): ApiResponse<AuditLog[]> => {
      return { success: true, data: AuditService.getLogs(limit) };
    },
  },

  // Users
  users: {
    list: (): ApiResponse<User[]> => {
      return { success: true, data: AuthService.getUsers() };
    },
  },

  // Categories
  categories: {
    list: (): ApiResponse<Category[]> => {
      return { success: true, data: CATEGORIES };
    },
  },
};
