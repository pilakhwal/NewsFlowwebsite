// ============================================================
// TASK CARD COMPONENT
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Edit2, Trash2, Calendar, Tag, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { formatDate, getPriorityColor, getStatusColor, getCategoryIcon, isOverdue, isDueToday } from '../utils/helpers';
import { TaskModal } from './TaskModal';

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const { deleteTask, toggleTaskStatus, toggleSubtask } = useTasks();
  const [expanded, setExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCompleted = task.status === 'done';
  const overdue = !isCompleted && isOverdue(task.dueDate);
  const dueToday = !isCompleted && isDueToday(task.dueDate);
  const subtasksCompleted = task.subtasks.filter(s => s.completed).length;
  const subtasksTotal = task.subtasks.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className={`group relative bg-white dark:bg-slate-800 rounded-xl border transition-all hover:shadow-md ${
          isCompleted
            ? 'border-slate-100 dark:border-slate-700 opacity-75'
            : overdue
            ? 'border-red-200 dark:border-red-800'
            : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400'
              }`}
              aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isCompleted && <Check className="w-3 h-3 text-white" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className={`text-sm font-medium leading-snug ${
                    isCompleted
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-white'
                  }`}
                >
                  {task.title}
                </h3>
                
                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500 transition-colors"
                    aria-label="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description preview */}
              {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {task.description}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                {/* Priority badge */}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>

                {/* Status badge */}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>

                {/* Category */}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {getCategoryIcon(task.category)}
                </span>

                {/* Due date */}
                {task.dueDate && (
                  <span className={`inline-flex items-center gap-1 text-xs ${
                    overdue ? 'text-red-500 font-medium' : dueToday ? 'text-amber-500 font-medium' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    {formatDate(task.dueDate)}
                  </span>
                )}

                {/* Subtasks count */}
                {subtasksTotal > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Check className="w-3 h-3" />
                    {subtasksCompleted}/{subtasksTotal}
                  </span>
                )}
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{task.tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* Expand subtasks */}
              {subtasksTotal > 0 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 mt-2 text-xs text-slate-500 hover:text-indigo-500 transition-colors"
                >
                  {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {expanded ? 'Hide' : 'Show'} subtasks
                </button>
              )}

              {/* Subtasks list */}
              {expanded && subtasksTotal > 0 && (
                <div className="mt-2 space-y-1.5 pl-1">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSubtask(task.id, subtask.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                          subtask.completed
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {subtask.completed && <Check className="w-2.5 h-2.5 text-white" />}
                      </button>
                      <span className={`text-xs ${subtask.completed ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300'}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overdue indicator bar */}
        {overdue && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl" />
        )}
        {dueToday && !overdue && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-xl" />
        )}
      </motion.div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Delete Task</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteTask(task.id); setShowDeleteConfirm(false); }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && (
        <TaskModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} task={task} />
      )}
    </>
  );
}
