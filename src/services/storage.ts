import { Birthday } from '../types/birthday';

const STORAGE_KEY = 'birthdays';
const ARCHIVE_KEY = 'archived_birthdays';

export function getStoredBirthdays(): Birthday[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getArchivedBirthdays(): Birthday[] {
  const stored = localStorage.getItem(ARCHIVE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function storeBirthdays(birthdays: Birthday[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
}

export function archiveBirthdays(birthdaysToArchive: Birthday[]): void {
  const archived = getArchivedBirthdays();
  const updatedArchive = [...archived, ...birthdaysToArchive];
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updatedArchive));
}

export function restoreFromArchive(ids: string[]): Birthday[] {
  const archived = getArchivedBirthdays();
  const toRestore = archived.filter(b => ids.includes(b.id));
  const remainingArchived = archived.filter(b => !ids.includes(b.id));
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(remainingArchived));
  return toRestore;
}