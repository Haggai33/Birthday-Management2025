```typescript
import { format } from 'date-fns';

export const formatters = {
  shortDate: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy');
  },

  longDate: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMMM d, yyyy');
  },

  time: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'HH:mm');
  },

  dateTime: (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm');
  }
};
```