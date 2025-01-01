import { Birthday } from '../../../../types/birthday';
import { convertGregorianToHebrew, getNextHebrewBirthdays } from '../../../hebcal';
import { createOperationLogger } from '../logging';
import { createBirthdayError } from '../errors';

export const enrichBirthdayData = async (birthday: Birthday): Promise<Birthday> => {
  const logger = createOperationLogger('enrichBirthdayData');
  logger.start({ birthdayId: birthday.id });
  
  try {
    if (!birthday.birthDate) {
      throw new Error('Birth date is required for enrichment');
    }

    const birthDate = new Date(birthday.birthDate);
    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid birth date format');
    }

    const hebrewDate = await convertGregorianToHebrew(birthDate, birthday.afterSunset);
    const nextBirthdays = await getNextHebrewBirthdays(birthDate, birthday.afterSunset);

    const enrichedData = {
      ...birthday,
      hebrewDate: hebrewDate.hebrew,
      nextBirthday: nextBirthdays[0]?.toISOString(),
      nextBirthdays: nextBirthdays.map(date => date.toISOString()),
      age: new Date().getFullYear() - birthDate.getFullYear()
    };

    logger.success();
    return enrichedData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to enrich birthday data';
    logger.error({ error, message: errorMessage });
    throw createBirthdayError('OPERATION_FAILED', errorMessage);
  }
};