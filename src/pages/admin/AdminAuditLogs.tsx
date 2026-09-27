// ============================================================
// ADMIN AUDIT LOGS PAGE
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Filter } from 'lucide-react';
import { AuditService, AuditLog } from '../../backend';

export function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLogs(AuditService.getLogs(100));
  }, []);

  const filteredLogs = filter
    ? logs.filter(l => l.action.includes(filter) || l.userName.toLowerCase().includes(filter.toLowerCase()) || l.resource.includes(filter))
    : logs;

  const actionColors: Record<string, string> = {
    'user.login': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'user.logout': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    'user.register': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'article.create': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'article.update': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'article.delete': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'article.status_change': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'article.auto_publish': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Audit Logs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{logs.length} entries recorded</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter by action, user, or resource..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Action</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Resource</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${actionColors[log.action] || 'bg-slate-100 text-slate-700'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{log.userName}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 font-mono">{log.resource}:{log.resourceId.substring(0, 8)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">{log.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
