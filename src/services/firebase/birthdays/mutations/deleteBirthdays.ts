import { auth, db } from '../../../../config/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { BIRTHDAYS_COLLECTION } from '../constants';
import { createBirthdayError } from '../errors';
import { createOperationLogger } from '../logging';
import { verifyBirthdayDocuments } from '../operations/verification';

export const deleteBirthdays = async (ids: string[]): Promise<void> => {
  const logger = createOperationLogger('deleteBirthdays');
  logger.start({ ids });
  
  if (!auth.currentUser) {
    throw createBirthdayError('UNAUTHORIZED', 'User must be authenticated to delete birthdays');
  }

  try {
    const verificationResults = await verifyBirthdayDocuments(ids);
    const batch = writeBatch(db);
    const currentUserId = auth.currentUser.uid;
    const failedIds: string[] = [];

    for (const { id, exists, data } of verificationResults) {
      if (!exists) {
        logger.warning(`Document ${id} not found`);
        continue;
      }

      // Allow deletion if:
      // 1. Document was imported via CSV (has explicit id)
      // 2. Current user is the creator
      // 3. Document has no createdBy field (legacy data)
      if (!data?.createdBy || 
          data.createdBy === currentUserId || 
          data.createdBy === 'IMPORTED_VIA_CSV') {
        const docRef = doc(db, BIRTHDAYS_COLLECTION, id);
        batch.delete(docRef);
        logger.success(`Document ${id} queued for deletion`);
      } else {
        failedIds.push(id);
        logger.warning(`Not authorized to delete document ${id}`);
      }
    }

    if (failedIds.length === ids.length) {
      throw createBirthdayError(
        'UNAUTHORIZED',
        `Not authorized to delete any of the selected documents`
      );
    }

    await batch.commit();
    logger.success(`Successfully deleted ${ids.length - failedIds.length} documents`);

    if (failedIds.length > 0) {
      throw createBirthdayError(
        'UNAUTHORIZED',
        `Failed to delete some documents: ${failedIds.join(', ')}`
      );
    }
  } catch (error) {
    logger.error(error);
    throw error instanceof Error 
      ? createBirthdayError('OPERATION_FAILED', error.message)
      : createBirthdayError('OPERATION_FAILED', 'Failed to delete birthdays');
  }
};