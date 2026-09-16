// ============================================================
// HELPER FUNCTIONS
// ============================================================

import { Task, TaskPriority, TaskFilters } from '../types';
import { format, isPast, isToday, isTomorrow, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d, yyyy');
}

export function formatDateTime(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'MMM d, yyyy h:mm a');
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return isPast(parseISO(dueDate)) && !isToday(parseISO(dueDate));
}

export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return isToday(parseISO(dueDate));
}

export function isDueThisWeek(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const date = parseISO(dueDate);
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  return isWithinInterval(date, { start, end });
}

export function getPriorityWeight(priority: TaskPriority): number {
  const weights: Record<TaskPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  return weights[priority];
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  let filtered = [...tasks];

  // Status filter
  if (filters.status !== 'all') {
    filtered = filtered.filter(t => t.status === filters.status);
  }

  // Priority filter
  if (filters.priority !== 'all') {
    filtered = filtered.filter(t => t.priority === filters.priority);
  }

  // Category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  // Search
  if (filters.search.trim()) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let comparison = 0;
    switch (filters.sortBy) {
      case 'priority':
        comparison = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = a.dueDate.localeCompare(b.dueDate);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
      default:
        comparison = b.createdAt.localeCompare(a.createdAt);
        break;
    }
    return filters.sortOrder === 'desc' ? comparison : -comparison;
  });

  return filtered;
}

export function getPriorityColor(priority: TaskPriority): string {
  const colors: Record<TaskPriority, string> = {
    critical: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    high: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    low: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  };
  return colors[priority];
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
  };
  return colors[status] || colors.todo;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    work: '💼',
    personal: '🏠',
    health: '💪',
    learning: '📚',
    finance: '💰',
    other: '📌',
  };
  return icons[category] || '📌';
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('At least one number');
  return { valid: errors.length === 0, errors };
}
