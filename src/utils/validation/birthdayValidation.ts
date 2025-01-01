```typescript
import { Birthday, NewBirthday } from '../../types/birthday';

export const birthdayValidation = {
  isValidName: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  isValidDate: (date: string): boolean => {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  },

  isValidGender: (gender: string): boolean => {
    return ['male', 'female', 'unknown'].includes(gender);
  },

  validateBirthday: (data: Partial<NewBirthday>): string[] => {
    const errors: string[] = [];

    if (!data.firstName || !birthdayValidation.isValidName(data.firstName)) {
      errors.push('First name must be at least 2 characters');
    }

    if (!data.lastName || !birthdayValidation.isValidName(data.lastName)) {
      errors.push('Last name must be at least 2 characters');
    }

    if (!data.birthDate || !birthdayValidation.isValidDate(data.birthDate)) {
      errors.push('Valid birth date is required');
    }

    if (data.gender && !birthdayValidation.isValidGender(data.gender)) {
      errors.push('Invalid gender value');
    }

    return errors;
  }
};
```