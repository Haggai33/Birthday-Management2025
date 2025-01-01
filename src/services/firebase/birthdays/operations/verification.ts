import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { BIRTHDAYS_COLLECTION } from '../constants';
import { createOperationLogger } from '../logging';
import { BirthdayDocument } from '../types';

export const verifyBirthdayDocuments = async (ids: string[]) => {
  const logger = createOperationLogger('verifyBirthdayDocuments');
  logger.start({ ids });
  
  const verificationPromises = ids.map(async id => {
    const docRef = doc(db, BIRTHDAYS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return { 
      id, 
      exists: docSnap.exists(),
      data: docSnap.exists() ? docSnap.data() as BirthdayDocument : null
    };
  });

  const verificationResults = await Promise.all(verificationPromises);
  const nonExistentIds = verificationResults
    .filter(result => !result.exists)
    .map(result => result.id);

  if (nonExistentIds.length > 0) {
    logger.warning(`Documents not found: ${nonExistentIds.join(', ')}`);
  }

  logger.success();
  return verificationResults;
};