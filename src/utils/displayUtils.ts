import { format } from 'date-fns';
import type { Birthday } from '../types/birthday';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd/MM/yyyy');
};

export const getBirthdayStatusClass = (birthday: Birthday): string => {
  const classes = [];
  
  if (isUpcoming(birthday)) {
    classes.push('bg-yellow-50');
  }
  if (birthday.needsSunsetVerification) {
    classes.push('bg-orange-50');
  }
  if (birthday.isDuplicate && !birthday.duplicateVerified) {
    classes.push('bg-purple-50');
  }
  
  return classes.join(' ');
};

export const isUpcoming = (birthday: Birthday): boolean => {
  if (!birthday.nextBirthday) return false;
  const nextBirthday = new Date(birthday.nextBirthday);
  const today = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);
  return nextBirthday >= today && nextBirthday <= twoWeeksFromNow;
};

export const isThisMonth = (birthday: Birthday): boolean => {
  if (!birthday.nextBirthday) return false;
  const nextBirthday = new Date(birthday.nextBirthday);
  const today = new Date();
  return nextBirthday.getMonth() === today.getMonth();
};