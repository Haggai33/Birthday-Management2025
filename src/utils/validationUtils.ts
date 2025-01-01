import type { Birthday } from '../types/birthday';

export const validateBirthdayFields = (birthday: Partial<Birthday>): string[] => {
  const errors: string[] = [];

  if (!birthday.firstName?.trim()) {
    errors.push('First name is required');
  }

  if (!birthday.lastName?.trim()) {
    errors.push('Last name is required');
  }

  if (!birthday.birthDate) {
    errors.push('Birth date is required');
  }

  if (!birthday.gender) {
    errors.push('Gender is required');
  }

  return errors;
};

export const validateCSVHeaders = (headers: string[]): string[] => {
  const requiredHeaders = ['First Name', 'Last Name', 'Birthday'];
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
  return missingHeaders;
};

export const validateCSVRow = (row: any, index: number): { isValid: boolean; error?: string } => {
  if (!row['First Name']?.trim()) {
    return { isValid: false, error: `Row ${index + 1}: Missing First Name` };
  }
  if (!row['Last Name']?.trim()) {
    return { isValid: false, error: `Row ${index + 1}: Missing Last Name` };
  }
  if (!row['Birthday']) {
    return { isValid: false, error: `Row ${index + 1}: Missing Birthday` };
  }
  if (!isValidDateFormat(row['Birthday'])) {
    return { isValid: false, error: `Row ${index + 1}: Invalid date format for Birthday` };
  }
  return { isValid: true };
};

export const isValidDateFormat = (dateStr: string): boolean => {
  if (!dateStr) return false;
  
  try {
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    }
    return false;
  } catch {
    return false;
  }
};