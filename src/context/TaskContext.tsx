// ============================================================
// TASK MANAGEMENT CONTEXT
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Task, Subtask, TaskFilters, DashboardStats, Notification } from '../types';
import { storage } from '../utils/storage';
import { generateId, filterTasks, isOverdue } from '../utils/helpers';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  stats: DashboardStats;
  notifications: Notification[];
  isLoading: boolean;
  setFilters: (filters: Partial<TaskFilters>) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'userId'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  dismissNotification: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const DEFAULT_FILTERS: TaskFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      const userTasks = storage.get<Task[]>(`tasks_${user.id}`, []);
      setTasks(userTasks);
      setIsLoading(false);
    } else {
      setTasks([]);
      setIsLoading(false);
    }
  }, [user]);

  // Persist tasks
  useEffect(() => {
    if (user) {
      storage.set(`tasks_${user.id}`, tasks);
    }
  }, [tasks, user]);

  const addNotification = useCallback((type: Notification['type'], message: string) => {
    const id = generateId();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const setFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  const stats = useMemo((): DashboardStats => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const overdue = tasks.filter(t => t.status !== 'done' && t.status !== 'archived' && isOverdue(t.dueDate)).length;
    
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const completedThisWeek = tasks.filter(t => {
      if (!t.completedAt) return false;
      return new Date(t.completedAt) >= weekStart;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, overdue, completedThisWeek, completionRate };
  }, [tasks]);

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'userId'>) => {
    if (!user) return;
    
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: taskData.status === 'done' ? new Date().toISOString() : null,
    };

    setTasks(prev => [newTask, ...prev]);
    addNotification('success', 'Task created successfully');
  }, [user, addNotification]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
      if (updates.status === 'done' && t.status !== 'done') {
        updated.completedAt = new Date().toISOString();
      } else if (updates.status && updates.status !== 'done') {
        updated.completedAt = null;
      }
      return updated;
    }));
    addNotification('success', 'Task updated successfully');
  }, [addNotification]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addNotification('info', 'Task deleted');
  }, [addNotification]);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newStatus = t.status === 'done' ? 'todo' : 'done';
      return {
        ...t,
        status: newStatus as Task['status'],
        completedAt: newStatus === 'done' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const addSubtask = useCallback((taskId: string, title: string) => {
    if (!title.trim()) return;
    const subtask: Subtask = { id: generateId(), title: title.trim(), completed: false };
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: [...t.subtasks, subtask], updatedAt: new Date().toISOString() };
    }));
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, []);

  const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, subtasks: t.subtasks.filter(s => s.id !== subtaskId), updatedAt: new Date().toISOString() };
    }));
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      filters,
      stats,
      notifications,
      isLoading,
      setFilters,
      createTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addSubtask,
      toggleSubtask,
      deleteSubtask,
      dismissNotification,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider');
  }
  return context;
}
