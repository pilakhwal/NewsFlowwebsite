// ============================================================
// NEWSLETTER COMPONENT
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
        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-center text-white"
      >
        <CheckCircle className="w-12 h-12 mx-auto mb-3" />
        <h3 className="text-xl font-bold mb-1">You're subscribed!</h3>
        <p className="text-emerald-100 text-sm">Check your inbox for a confirmation email.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-8 text-white">
      <div className="max-w-lg mx-auto text-center">
        <Mail className="w-10 h-10 mx-auto mb-3 opacity-90" />
        <h3 className="text-xl font-bold mb-1">Stay Informed</h3>
        <p className="text-red-100 text-sm mb-5">Get the top stories delivered to your inbox every morning.</p>
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
            className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors shadow-sm"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-red-200 mt-3">No spam. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
