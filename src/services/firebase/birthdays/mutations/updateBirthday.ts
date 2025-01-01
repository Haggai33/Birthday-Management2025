import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebase';
import { BIRTHDAYS_COLLECTION } from '../constants';
import { NewBirthday, Birthday } from '../../../../types/birthday';
import { validateBirthdayData } from '../validation';
import { createBirthdayError } from '../errors';
import { createOperationLogger } from '../logging';
import { enrichBirthdayData } from '../operations/enrichment';

export const updateBirthday = async (id: string, data: Partial<NewBirthday>): Promise<Birthday> => {
  const logger = createOperationLogger('updateBirthday');
  logger.start({ id });
  
  if (!auth.currentUser) {
    throw createBirthdayError('UNAUTHORIZED', 'User must be authenticated to update birthdays');
  }

  const validationErrors = validateBirthdayData(data);
  if (validationErrors.length > 0) {
    throw createBirthdayError('VALIDATION_FAILED', validationErrors.join(', '));
  }

  try {
    const birthdayRef = doc(db, BIRTHDAYS_COLLECTION, id);
    const birthdaySnap = await getDoc(birthdayRef);
    
    if (!birthdaySnap.exists()) {
      throw createBirthdayError('NOT_FOUND', 'Birthday not found');
    }

    const currentData = birthdaySnap.data();
    const updateData = {
      ...data,
      needsGenderVerification: data.gender === undefined,
      needsSunsetVerification: data.afterSunset === undefined,
      updatedAt: serverTimestamp()
    };

    await updateDoc(birthdayRef, updateData);
    logger.success();

    return enrichBirthdayData({
      id,
      ...currentData,
      ...updateData,
      updatedAt: new Date().toISOString()
    } as Birthday);
  } catch (error) {
    logger.error(error);
    throw error instanceof Error 
      ? createBirthdayError('OPERATION_FAILED', error.message)
      : createBirthdayError('OPERATION_FAILED', 'Failed to update birthday');
  }
};