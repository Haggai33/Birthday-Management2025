```typescript
import { Birthday } from '../../../types/birthday';

const CACHE_KEY = 'birthdays_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: Birthday[];
  timestamp: number;
}

export const cacheService = {
  set: (birthdays: Birthday[]) => {
    const entry: CacheEntry = {
      data: birthdays,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  },

  get: (): Birthday[] | null => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return entry.data;
  },

  clear: () => {
    localStorage.removeItem(CACHE_KEY);
  }
};
```