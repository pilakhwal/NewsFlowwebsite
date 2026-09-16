// ============================================================
// TASK MANAGER - TYPE DEFINITIONS
// ============================================================

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'archived';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'finance' | 'other';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  tags: string[];
  subtasks: Subtask[];
  userId: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TaskFilters {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  search: string;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completedThisWeek: number;
  completionRate: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
