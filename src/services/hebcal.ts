import { format } from 'date-fns';

interface HebrewDate {
  gy: number;
  gm: number;
  gd: number;
  hy: number;
  hm: string;
  hd: number;
  hebrew: string;
}

export async function convertGregorianToHebrew(date: Date, afterSunset: boolean = false): Promise<HebrewDate> {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const sunset = afterSunset ? '&gs=on' : '&gs=off';
  const url = `https://www.hebcal.com/converter?cfg=json&date=${formattedDate}&g2h=1&strict=1${sunset}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error converting Gregorian to Hebrew date:', error);
    throw error;
  }
}

export async function getNextHebrewBirthdays(birthDate: Date, afterSunset: boolean): Promise<Date[]> {
  try {
    const hebrewBirthDate = await convertGregorianToHebrew(birthDate, afterSunset);
    const today = new Date();
    const nextBirthdays: Date[] = [];
    let currentYear = hebrewBirthDate.hy;
    
    while (nextBirthdays.length < 5) {
      try {
        const url = `https://www.hebcal.com/converter?cfg=json&hy=${currentYear}&hm=${hebrewBirthDate.hm}&hd=${hebrewBirthDate.hd}&h2g=1`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const nextDate = new Date(data.gy, data.gm - 1, data.gd);
        
        if (nextDate > today) {
          nextBirthdays.push(nextDate);
        }
        
        currentYear++;
      } catch (error) {
        console.error('Error calculating next birthday:', error);
        currentYear++;
      }
    }

    return nextBirthdays;
  } catch (error) {
    console.error('Error getting next Hebrew birthdays:', error);
    throw error;
  }
}

export async function getCurrentHebrewYear(): Promise<number> {
  try {
    const today = new Date();
    const hebrewDate = await convertGregorianToHebrew(today, false);
    return hebrewDate.hy;
  } catch (error) {
    console.error('Error getting current Hebrew year:', error);
    throw error;
  }
}

export function calculateHebrewAge(birthYear: number, currentHebrewYear: number): number {
  return currentHebrewYear - birthYear;
}