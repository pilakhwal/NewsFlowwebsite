// ============================================================
// DASHBOARD PAGE
// ============================================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ListTodo,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ArrowRight,
  Zap,
  Target,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { isOverdue, isDueToday, isDueThisWeek, getPriorityWeight } from '../utils/helpers';
import { Task } from '../types';

export function Dashboard() {
  const { user } = useAuth();
  const { tasks, stats } = useTasks();

  // Get tasks due today or overdue
  const urgentTasks = tasks
    .filter(t => t.status !== 'done' && t.status !== 'archived' && (isOverdue(t.dueDate) || isDueToday(t.dueDate)))
    .sort((a, b) => {
      if (isOverdue(a.dueDate) && !isOverdue(b.dueDate)) return -1;
      if (!isOverdue(a.dueDate) && isOverdue(b.dueDate)) return 1;
      return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    })
    .slice(0, 5);

  // Get high priority tasks
  const highPriorityTasks = tasks
    .filter(t => t.status !== 'done' && t.status !== 'archived' && (t.priority === 'critical' || t.priority === 'high'))
    .sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority))
    .slice(0, 3);

  // Recently completed
  const recentCompleted = tasks
    .filter(t => t.status === 'done' && t.completedAt)
    .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
    .slice(0, 3);

  // This week's tasks
  const thisWeekTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'archived' && isDueThisWeek(t.dueDate)).length;

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {stats.overdue > 0
            ? `You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''} that need attention.`
            : stats.total === 0
            ? "Let's create your first task to get started!"
            : `You have ${stats.total - stats.completed} task${stats.total - stats.completed !== 1 ? 's' : ''} remaining.`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('emerald') ? '#10b981' : stat.color.includes('amber') ? '#f59e0b' : '#ef4444' }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
            </div>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{stats.completionRate}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{stats.completed} completed</span>
            <span>{stats.total - stats.completed} remaining</span>
          </div>
        </motion.div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Urgent</h2>
            </div>
            <Link to="/tasks" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {urgentTasks.length > 0 ? (
            <div className="space-y-3">
              {urgentTasks.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No urgent tasks! 🎉</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* High Priority */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">High Priority</h2>
              </div>
            </div>
            {highPriorityTasks.length > 0 ? (
              <div className="space-y-3">
                {highPriorityTasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} index={i} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <TrendingUp className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No high priority tasks</p>
              </div>
            )}
          </div>

          {/* This Week */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">This Week</h2>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-3xl font-bold text-slate-800 dark:text-white">{thisWeekTasks}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">tasks due</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completedThisWeek}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">completed</p>
              </div>
            </div>
          </div>

          {/* Recently Completed */}
          {recentCompleted.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Recently Completed
              </h2>
              <div className="space-y-2">
                {recentCompleted.map(task => (
                  <div key={task.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400 line-through truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
