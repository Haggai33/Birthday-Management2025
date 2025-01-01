import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { BIRTHDAYS_COLLECTION } from '../constants';
import { createOperationLogger } from '../logging';

export const performBatchDelete = async (ids: string[]) => {
  const logger = createOperationLogger('performBatchDelete');
  logger.start({ ids });
  
  const batch = writeBatch(db);
  ids.forEach(id => {
    const birthdayRef = doc(db, BIRTHDAYS_COLLECTION, id);
    batch.delete(birthdayRef);
  });

  await batch.commit();
  logger.success();
};