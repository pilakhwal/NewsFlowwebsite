// ============================================================
// FOOTER COMPONENT - PROFESSIONAL DESIGN
// ============================================================

import { Link } from 'react-router-dom';
import { Newspaper, Twitter, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { CATEGORIES } from '../data/articles';

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl mb-4 shadow-lg shadow-brand-500/20">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Stay Informed</h3>
            <p className="text-slate-400 mb-6">Get the top stories delivered to your inbox every morning.</p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-brand-500/20"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-brand-500/40 transition-shadow">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  News<span className="text-gradient">Flow</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Delivering trusted news and insightful analysis from around the world, 24/7.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-brand-600 transition-colors group" aria-label="Twitter">
                <Twitter className="w-4 h-4 group-hover:text-white" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-brand-600 transition-colors group" aria-label="Facebook">
                <Facebook className="w-4 h-4 group-hover:text-white" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-brand-600 transition-colors group" aria-label="Instagram">
                <Instagram className="w-4 h-4 group-hover:text-white" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-800 hover:bg-brand-600 transition-colors group" aria-label="YouTube">
                <Youtube className="w-4 h-4 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2">
                    <span>{cat.icon}</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Contact', 'Advertise', 'Ethics Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility', 'Corrections'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-brand-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} NewsFlow. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
