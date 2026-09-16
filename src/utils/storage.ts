// ============================================================
// LOCAL STORAGE UTILITIES
// ============================================================

const PREFIX = 'taskmanager_';

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage write error:', error);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (error) {
      console.error('Storage delete error:', error);
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
      keys.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
};
