import { Birthday, NewBirthday } from '../types/birthday';
import { convertGregorianToHebrew, getNextHebrewBirthdays, getCurrentHebrewYear } from './hebcal';
import { format } from 'date-fns';

// Get stored birthdays from localStorage
const getStoredBirthdays = (): Birthday[] => {
  const stored = localStorage.getItem('birthdays');
  return stored ? JSON.parse(stored) : [];
};

// Save birthdays to localStorage
const saveBirthdays = (birthdays: Birthday[]) => {
  localStorage.setItem('birthdays', JSON.stringify(birthdays));
};

export async function getBirthdays(): Promise<Birthday[]> {
  try {
    const birthdays = getStoredBirthdays();
    const currentHebrewYear = await getCurrentHebrewYear();
    
    const birthdaysWithDates = await Promise.all(
      birthdays.map(async (birthday) => {
        try {
          const birthDate = new Date(birthday.birthDate);
          const hebrewDate = await convertGregorianToHebrew(birthDate, birthday.afterSunset);
          const nextBirthdays = await getNextHebrewBirthdays(birthDate, birthday.afterSunset);
          const age = currentHebrewYear - hebrewDate.hy;

          return {
            ...birthday,
            hebrewDate: hebrewDate.hebrew,
            nextBirthday: nextBirthdays[0] ? format(nextBirthdays[0], 'yyyy-MM-dd') : undefined,
            nextBirthdays: nextBirthdays.map(date => format(date, 'yyyy-MM-dd')),
            age
          };
        } catch (error) {
          console.error(`Error processing birthday for ${birthday.firstName}:`, error);
          return birthday;
        }
      })
    );

    return birthdaysWithDates.filter(b => !b.archived);
  } catch (error) {
    console.error('Error fetching birthdays:', error);
    throw new Error('Failed to fetch birthdays');
  }
}

export async function getBirthday(id: string): Promise<Birthday> {
  const birthdays = getStoredBirthdays();
  const birthday = birthdays.find(b => b.id === id);
  if (!birthday) throw new Error('Birthday not found');
  return birthday;
}

export async function addBirthdays(data: NewBirthday[]): Promise<Birthday[]> {
  try {
    const existingBirthdays = getStoredBirthdays();
    const currentHebrewYear = await getCurrentHebrewYear();
    
    const newBirthdays = await Promise.all(data.map(async (item) => {
      const id = crypto.randomUUID();
      const birthDate = new Date(item.birthDate);
      const hebrewDate = await convertGregorianToHebrew(birthDate, item.afterSunset);
      
      // Check for duplicates
      const isDuplicate = existingBirthdays.some(existing => 
        existing.firstName.toLowerCase() === item.firstName.toLowerCase() &&
        existing.lastName.toLowerCase() === item.lastName.toLowerCase() &&
        existing.birthDate === item.birthDate
      );

      return {
        ...item,
        id,
        age: currentHebrewYear - hebrewDate.hy,
        archived: false,
        isDuplicate: isDuplicate || undefined,
        duplicateVerified: false,
        needsSunsetVerification: item.afterSunset === undefined,
        gender: item.gender || undefined
      };
    }));
    
    existingBirthdays.push(...newBirthdays);
    saveBirthdays(existingBirthdays);
    return newBirthdays;
  } catch (error) {
    console.error('Error adding birthdays:', error);
    throw new Error('Failed to add birthdays');
  }
}

export async function addBirthday(data: NewBirthday): Promise<Birthday> {
  return (await addBirthdays([data]))[0];
}

export async function updateBirthday(id: string, data: Partial<NewBirthday & { duplicateVerified?: boolean }>): Promise<Birthday> {
  try {
    const birthdays = getStoredBirthdays();
    const index = birthdays.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Birthday not found');
    
    const birthDate = new Date(data.birthDate || birthdays[index].birthDate);
    const hebrewDate = await convertGregorianToHebrew(birthDate, data.afterSunset ?? birthdays[index].afterSunset);
    const currentHebrewYear = await getCurrentHebrewYear();
    
    birthdays[index] = {
      ...birthdays[index],
      ...data,
      age: currentHebrewYear - hebrewDate.hy,
      needsSunsetVerification: data.afterSunset === undefined ? true : false
    };
    
    saveBirthdays(birthdays);
    return birthdays[index];
  } catch (error) {
    console.error('Error updating birthday:', error);
    throw new Error('Failed to update birthday');
  }
}

export async function verifyDuplicate(id: string): Promise<void> {
  const birthdays = getStoredBirthdays();
  const index = birthdays.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Birthday not found');
  
  birthdays[index].duplicateVerified = true;
  saveBirthdays(birthdays);
}

export async function deleteBirthdays(ids: string[]): Promise<void> {
  const birthdays = getStoredBirthdays();
  const filtered = birthdays.filter(b => !ids.includes(b.id));
  saveBirthdays(filtered);
}

export async function archiveBirthday(id: string): Promise<void> {
  const birthdays = getStoredBirthdays();
  const index = birthdays.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Birthday not found');
  
  birthdays[index].archived = true;
  saveBirthdays(birthdays);
}

export async function getArchivedBirthdays(): Promise<Birthday[]> {
  const birthdays = getStoredBirthdays();
  return birthdays.filter(b => b.archived);
}

export async function restoreBirthday(id: string): Promise<void> {
  const birthdays = getStoredBirthdays();
  const index = birthdays.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Birthday not found');
  
  birthdays[index].archived = false;
  saveBirthdays(birthdays);
}