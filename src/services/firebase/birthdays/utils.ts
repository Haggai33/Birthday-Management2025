import { Birthday } from '../../../types/birthday';
import { convertGregorianToHebrew, getNextHebrewBirthdays } from '../../hebcal';

export const enrichBirthdayData = async (birthday: Birthday): Promise<Birthday> => {
  try {
    const birthDate = new Date(birthday.birthDate);
    const hebrewDate = await convertGregorianToHebrew(birthDate, birthday.afterSunset);
    const nextBirthdays = await getNextHebrewBirthdays(birthDate, birthday.afterSunset);

    return {
      ...birthday,
      hebrewDate: hebrewDate.hebrew,
      nextBirthday: nextBirthdays[0]?.toISOString(),
      nextBirthdays: nextBirthdays.map(date => date.toISOString()),
      age: new Date().getFullYear() - birthDate.getFullYear()
    };
  } catch (error) {
    console.error(`Error enriching birthday data:`, error);
    throw error;
  }
};