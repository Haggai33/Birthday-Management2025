import { NewBirthday } from '../../../types/birthday';

export const validateBirthdayData = (data: Partial<NewBirthday>): string[] => {
  const errors: string[] = [];

  // Required field checks
  if (!data.firstName?.trim()) {
    errors.push('First name is required');
  } else if (data.firstName.trim().length < 2) {
    errors.push('First name must be at least 2 characters');
  }

  if (!data.lastName?.trim()) {
    errors.push('Last name is required');
  } else if (data.lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  // Birth date validation
  if (!data.birthDate) {
    errors.push('Birth date is required');
  } else {
    const date = new Date(data.birthDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid birth date format');
    } else {
      // Check if date is in the future
      if (date > new Date()) {
        errors.push('Birth date cannot be in the future');
      }
      // Check if date is too far in the past (e.g., over 150 years ago)
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 150);
      if (date < minDate) {
        errors.push('Birth date is too far in the past');
      }
    }
  }

  // Gender validation (if provided)
  if (data.gender && !['male', 'female', 'unknown'].includes(data.gender)) {
    errors.push('Invalid gender value');
  }

  // After sunset validation (if provided)
  if (data.afterSunset !== undefined && typeof data.afterSunset !== 'boolean') {
    errors.push('After sunset must be a boolean value');
  }

  return errors;
};