// ============================================================
// ADMIN USERS MANAGEMENT PAGE
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, UserPlus, Mail } from 'lucide-react';
import { AuthService } from '../../backend';
import { User, UserRole } from '../../types';
import { getRoleLabel, getRoleColor } from '../../context/AuthContext';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'contributor' as UserRole });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setUsers(AuthService.getUsers());
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = AuthService.register(newUser.name, newUser.email, newUser.password, newUser.role);
    if (result.success) {
      setSuccess(`User "${newUser.name}" created successfully`);
      setUsers(AuthService.getUsers());
      setNewUser({ name: '', email: '', password: '', role: 'contributor' });
      setShowAddForm(false);
    } else {
      setError(result.error || 'Failed to create user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">User Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{users.length} users registered</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Create New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                >
                  <option value="contributor">Contributor</option>
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                Create User
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Created</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.avatar}
                      </div>
                      <span className="text-sm font-medium text-slate-800 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-500" />
          Role Permissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Super Admin</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>✓ Full system access</li>
              <li>✓ Manage users & roles</li>
              <li>✓ Publish & delete articles</li>
              <li>✓ View audit logs</li>
              <li>✓ System configuration</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Editor</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>✓ Create & edit articles</li>
              <li>✓ Publish articles</li>
              <li>✓ Review submissions</li>
              <li>✓ Manage categories</li>
              <li>✗ Manage users</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Author</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>✓ Create drafts</li>
              <li>✓ Edit own articles</li>
              <li>✓ Submit for review</li>
              <li>✗ Publish articles</li>
              <li>✗ Delete articles</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Contributor</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>✓ Create drafts</li>
              <li>✓ Edit own drafts</li>
              <li>✗ Submit for review</li>
              <li>✗ Publish articles</li>
              <li>✗ Delete articles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
