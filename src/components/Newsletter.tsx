// ============================================================
// NEWSLETTER COMPONENT - ENHANCED DESIGN
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setStatus('success');
      setEmail('');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-center text-white shadow-xl shadow-emerald-500/20"
      >
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">You're subscribed!</h3>
        <p className="text-emerald-100">Check your inbox for a confirmation email.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-8 text-white shadow-xl shadow-brand-500/20">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Stay Informed</h3>
        <p className="text-brand-100 mb-6">Get the top stories delivered to your inbox every morning.</p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors shadow-lg"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-brand-200 mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
