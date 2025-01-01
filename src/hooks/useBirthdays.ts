import { useState, useEffect } from 'react';
import { Birthday, BirthdayFormData } from '../types/birthday';
import { getStoredBirthdays, storeBirthdays } from '../services/storage';
import { 
  convertGregorianToHebrew, 
  getNextHebrewBirthdays,
  getCurrentHebrewYear,
  calculateHebrewAge 
} from '../services/hebcal';

export function useBirthdays() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      const stored = getStoredBirthdays();
      const currentHebrewYear = await getCurrentHebrewYear();
      
      const updatedBirthdays = await Promise.all(
        stored.map(async (birthday) => {
          try {
            const birthDate = new Date(birthday.birthDate);
            const hebrewDate = await convertGregorianToHebrew(birthDate, birthday.afterSunset);
            const nextBirthdays = await getNextHebrewBirthdays(
              { hy: hebrewDate.hy, hm: hebrewDate.hm, hd: hebrewDate.hd },
              birthday.afterSunset
            );

            return {
              ...birthday,
              hebrewDate: hebrewDate.hebrew,
              nextBirthday: nextBirthdays[0]?.toISOString() || '',
              age: new Date().getFullYear() - birthDate.getFullYear(),
              hebrewAge: calculateHebrewAge(hebrewDate.hy, currentHebrewYear)
            };
          } catch (error) {
            console.error('Error calculating next birthday:', error);
            return birthday;
          }
        })
      );

      setBirthdays(updatedBirthdays);
      setError(null);
    } catch (err) {
      setError('Failed to load birthdays');
      console.error('Error loading birthdays:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBirthday = async (data: BirthdayFormData) => {
    try {
      const id = crypto.randomUUID();
      const birthDate = new Date(data.birthDate);
      const hebrewDate = await convertGregorianToHebrew(birthDate, data.afterSunset);
      const currentHebrewYear = await getCurrentHebrewYear();
      const nextBirthdays = await getNextHebrewBirthdays(
        { hy: hebrewDate.hy, hm: hebrewDate.hm, hd: hebrewDate.hd },
        data.afterSunset
      );

      const newBirthday: Birthday = {
        id,
        ...data,
        hebrewDate: hebrewDate.hebrew,
        nextBirthday: nextBirthdays[0]?.toISOString() || '',
        age: new Date().getFullYear() - birthDate.getFullYear(),
        hebrewAge: calculateHebrewAge(hebrewDate.hy, currentHebrewYear)
      };

      const updated = [...birthdays, newBirthday];
      setBirthdays(updated);
      storeBirthdays(updated);
      return newBirthday;
    } catch (err) {
      setError('Failed to add birthday');
      throw err;
    }
  };

  const updateBirthday = async (id: string, data: BirthdayFormData) => {
    try {
      const birthDate = new Date(data.birthDate);
      const hebrewDate = await convertGregorianToHebrew(birthDate, data.afterSunset);
      const currentHebrewYear = await getCurrentHebrewYear();
      const nextBirthdays = await getNextHebrewBirthdays(
        { hy: hebrewDate.hy, hm: hebrewDate.hm, hd: hebrewDate.hd },
        data.afterSunset
      );

      const updated = birthdays.map(birthday => 
        birthday.id === id
          ? {
              ...birthday,
              ...data,
              hebrewDate: hebrewDate.hebrew,
              nextBirthday: nextBirthdays[0]?.toISOString() || '',
              age: new Date().getFullYear() - birthDate.getFullYear(),
              hebrewAge: calculateHebrewAge(hebrewDate.hy, currentHebrewYear)
            }
          : birthday
      );

      setBirthdays(updated);
      storeBirthdays(updated);
    } catch (err) {
      setError('Failed to update birthday');
      throw err;
    }
  };

  const deleteBirthdays = (ids: string[]) => {
    try {
      const updated = birthdays.filter(birthday => !ids.includes(birthday.id));
      setBirthdays(updated);
      storeBirthdays(updated);
    } catch (err) {
      setError('Failed to delete birthdays');
      throw err;
    }
  };

  return {
    birthdays,
    loading,
    error,
    addBirthday,
    updateBirthday,
    deleteBirthdays,
    refresh: loadBirthdays
  };
}