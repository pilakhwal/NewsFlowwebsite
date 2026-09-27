// ============================================================
// NEWS WEBSITE - UTILITY FUNCTIONS
// ============================================================

import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  return format(date, 'MMMM d, yyyy');
}

export function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  return format(date, 'MMM d');
}

export function getExcerpt(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getReadingTime(content: string[]): number {
  const words = content.join(' ').split(/\s+/).length;
  return Math.ceil(words / 200); // Average reading speed: 200 words per minute
}
