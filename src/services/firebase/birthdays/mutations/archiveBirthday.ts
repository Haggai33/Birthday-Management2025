import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebase';
import { BIRTHDAYS_COLLECTION, ARCHIVED_COLLECTION } from '../constants';
import { createBirthdayError } from '../errors';
import { createOperationLogger } from '../logging';

export const archiveBirthday = async (id: string): Promise<void> => {
  const logger = createOperationLogger('archiveBirthday');
  logger.start({ id });
  
  if (!auth.currentUser) {
    throw createBirthdayError('UNAUTHORIZED', 'User must be authenticated to archive birthdays');
  }

  try {
    const birthdayRef = doc(db, BIRTHDAYS_COLLECTION, id);
    const birthdaySnap = await getDoc(birthdayRef);
    
    if (!birthdaySnap.exists()) {
      throw createBirthdayError('NOT_FOUND', 'Birthday not found');
    }

    const batch = writeBatch(db);
    const birthdayData = birthdaySnap.data();

    // Add to archived collection
    const archivedRef = doc(db, ARCHIVED_COLLECTION, id);
    batch.set(archivedRef, {
      ...birthdayData,
      archived: true,
      archivedAt: serverTimestamp()
    });

    // Delete from main collection
    batch.delete(birthdayRef);

    await batch.commit();
    logger.success();
  } catch (error) {
    logger.error(error);
    throw error instanceof Error 
      ? createBirthdayError('OPERATION_FAILED', error.message)
      : createBirthdayError('OPERATION_FAILED', 'Failed to archive birthday');
  }
};