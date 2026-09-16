// ============================================================
// TASK LIST PAGE - WITH FILTERING & SEARCH
// ============================================================

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ListTodo,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { TaskStatus, TaskPriority, TaskCategory } from '../types';

interface TaskListProps {
  onNewTask: () => void;
}

export function TaskList({ onNewTask }: TaskListProps) {
  const { filteredTasks, filters, setFilters, tasks, stats } = useTasks();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL params with filters
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam && ['todo', 'in_progress', 'review', 'done', 'archived'].includes(statusParam)) {
      setFilters({ status: statusParam as TaskStatus });
    }
  }, [searchParams, setFilters]);

  const statusOptions: { value: TaskStatus | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: tasks.length },
    { value: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length },
    { value: 'in_progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
    { value: 'review', label: 'Review', count: tasks.filter(t => t.status === 'review').length },
    { value: 'done', label: 'Done', count: tasks.filter(t => t.status === 'done').length },
    { value: 'archived', label: 'Archived', count: tasks.filter(t => t.status === 'archived').length },
  ];

  const priorityOptions: { value: TaskPriority | 'all'; label: string }[] = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: '🔴 Critical' },
    { value: 'high', label: '🟠 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low', label: '🟢 Low' },
  ];

  const categoryOptions: { value: TaskCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'work', label: '💼 Work' },
    { value: 'personal', label: '🏠 Personal' },
    { value: 'health', label: '💪 Health' },
    { value: 'learning', label: '📚 Learning' },
    { value: 'finance', label: '💰 Finance' },
    { value: 'other', label: '📌 Other' },
  ];

  const activeFilterCount = [
    filters.priority !== 'all',
    filters.category !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ priority: 'all', category: 'all', search: '', status: 'all' });
    setSearchParams({});
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            {filters.status !== 'all' && ` • ${statusOptions.find(s => s.value === filters.status)?.label}`}
          </p>
        </div>
        <button
          onClick={onNewTask}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <ListTodo className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              aria-label="Search tasks"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort toggle */}
          <button
            onClick={() => setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
            aria-label="Toggle sort order"
          >
            {filters.sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => {
                setFilters({ status: option.value });
                if (option.value === 'all') {
                  setSearchParams({});
                } else {
                  setSearchParams({ status: option.value });
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filters.status === option.value
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {option.label}
              {option.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filters.status === option.value
                    ? 'bg-indigo-200 dark:bg-indigo-800'
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Priority filter */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Priority</label>
                    <select
                      value={filters.priority}
                      onChange={e => setFilters({ priority: e.target.value as TaskPriority | 'all' })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {priorityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category filter */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Category</label>
                    <select
                      value={filters.category}
                      onChange={e => setFilters({ category: e.target.value as TaskCategory | 'all' })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {categoryOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort by */}
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={e => setFilters({ sortBy: e.target.value as typeof filters.sortBy })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="createdAt">Date Created</option>
                      <option value="dueDate">Due Date</option>
                      <option value="priority">Priority</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center"
        >
          {tasks.length === 0 ? (
            <>
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">No tasks yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Create your first task to start organizing your work.
              </p>
              <button
                onClick={onNewTask}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
              >
                <ListTodo className="w-4 h-4" />
                Create Task
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">No matching tasks</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear filters
              </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
