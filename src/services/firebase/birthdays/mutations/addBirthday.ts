import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebase';
import { BIRTHDAYS_COLLECTION } from '../constants';
import { NewBirthday, Birthday } from '../../../../types/birthday';
import { validateBirthdayData } from '../validation';
import { createBirthdayError } from '../errors';
import { createOperationLogger } from '../logging';
import { enrichBirthdayData } from '../operations/enrichment';

export const addBirthday = async (data: NewBirthday): Promise<Birthday> => {
  const logger = createOperationLogger('addBirthday');
  logger.start({ data });
  
  if (!auth.currentUser) {
    throw createBirthdayError('UNAUTHORIZED', 'User must be authenticated to add birthdays');
  }

  // Validate birthday data
  const validationErrors = validateBirthdayData(data);
  if (validationErrors.length > 0) {
    const errorMessage = validationErrors.join(', ');
    logger.error(`Validation failed: ${errorMessage}`);
    throw createBirthdayError('VALIDATION_FAILED', errorMessage);
  }

  try {
    // Prepare birthday data with required fields
    const birthdayData = {
      ...data,
      createdBy: auth.currentUser.uid,
      archived: false,
      isDuplicate: false,
      duplicateVerified: false,
      needsGenderVerification: !data.gender || data.gender === 'unknown',
      needsSunsetVerification: data.afterSunset === undefined,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, BIRTHDAYS_COLLECTION), birthdayData);
    logger.success({ id: docRef.id });

    // Enrich and return the birthday data
    const enrichedData = await enrichBirthdayData({
      id: docRef.id,
      ...birthdayData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Birthday);

    return enrichedData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to add birthday';
    logger.error({ error, message: errorMessage });
    throw createBirthdayError('OPERATION_FAILED', errorMessage);
  }
};