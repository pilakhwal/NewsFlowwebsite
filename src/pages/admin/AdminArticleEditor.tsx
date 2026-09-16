// ============================================================
// ADMIN ARTICLE EDITOR
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye, Send, CheckCircle } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES, getArticleById } from '../../data/articles';
import { AUTHORS } from '../../data/authors';
import { Article, ArticleStatus, CategorySlug } from '../../types';

export function AdminArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createArticle, updateArticle, changeStatus } = useContent();
  const { user, canPublish } = useAuth();
  const isNew = id === 'new';

  const existingArticle = !isNew && id ? getArticleById(id) : null;

  const [title, setTitle] = useState(existingArticle?.title || '');
  const [subtitle, setSubtitle] = useState(existingArticle?.subtitle || '');
  const [excerpt, setExcerpt] = useState(existingArticle?.excerpt || '');
  const [content, setContent] = useState(existingArticle?.content.join('\n\n') || '');
  const [category, setCategory] = useState<CategorySlug>(existingArticle?.category || 'world');
  const [authorId, setAuthorId] = useState(existingArticle?.authorId || 'author-1');
  const [imageUrl, setImageUrl] = useState(existingArticle?.imageUrl || '');
  const [imageCaption, setImageCaption] = useState(existingArticle?.imageCaption || '');
  const [tags, setTags] = useState(existingArticle?.tags.join(', ') || '');
  const [isBreaking, setIsBreaking] = useState(existingArticle?.isBreaking || false);
  const [isFeatured, setIsFeatured] = useState(existingArticle?.isFeatured || false);
  const [status, setStatus] = useState<ArticleStatus>(existingArticle?.status || 'draft');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (newStatus?: ArticleStatus) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));

    const articleData: Partial<Article> = {
      title,
      subtitle,
      excerpt,
      content: content.split('\n\n').filter(p => p.trim()),
      category,
      authorId,
      author: AUTHORS.find(a => a.id === authorId) || AUTHORS[0],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop',
      imageCaption,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isBreaking,
      isFeatured,
      status: newStatus || status,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'untitled',
      readTime: Math.ceil(content.split(/\s+/).length / 200),
    };

    if (isNew) {
      createArticle(articleData);
    } else if (id) {
      updateArticle(id, articleData);
      if (newStatus && newStatus !== status) {
        changeStatus(id, newStatus);
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/articles" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              {isNew ? 'New Article' : 'Edit Article'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {existingArticle ? `Version ${existingArticle.version} • Last updated ${new Date(existingArticle.updatedAt).toLocaleDateString()}` : 'Create a new article'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Draft'}
          </button>
          {canPublish() && (
            <button
              onClick={() => handleSave('published')}
              disabled={saving || !title}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Headline *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter article headline..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-lg font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subheadline</label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            placeholder="Optional subheadline or deck..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Category & Author */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CategorySlug)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Author</label>
            <select
              value={authorId}
              onChange={e => setAuthorId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {AUTHORS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="Brief summary for article cards and SEO..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Body <span className="text-xs text-slate-400">(separate paragraphs with blank lines)</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your article content here. Use blank lines to separate paragraphs..."
            rows={12}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-y font-serif text-base leading-relaxed"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Featured Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {imageUrl && (
            <div className="mt-2 rounded-lg overflow-hidden max-h-48">
              <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Image Caption</label>
          <input
            type="text"
            value={imageCaption}
            onChange={e => setImageCaption(e.target.value)}
            placeholder="Optional caption for the featured image..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="technology, science, innovation..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={e => setIsBreaking(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Breaking News</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">Featured Story</span>
          </label>
        </div>
      </div>
    </div>
  );
}
