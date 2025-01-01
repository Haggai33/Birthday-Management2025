import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebase';
import { Birthday } from '../../../../types/birthday';
import { BIRTHDAYS_COLLECTION } from '../constants';
import { enrichBirthdayData } from '../utils';
import { createOperationLogger } from '../logging';
import { createBirthdayError } from '../errors';

export const getBirthdays = async (): Promise<Birthday[]> => {
  const logger = createOperationLogger('getBirthdays');
  
  if (!auth.currentUser) {
    throw createBirthdayError('UNAUTHORIZED', 'User must be authenticated to fetch birthdays');
  }

  try {
    logger.start();
    const q = query(
      collection(db, BIRTHDAYS_COLLECTION),
      where('archived', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    logger.success({ count: querySnapshot.size });
    
    return Promise.all(
      querySnapshot.docs.map(async doc => {
        const data = doc.data();
        return enrichBirthdayData({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        } as Birthday);
      })
    );
  } catch (error) {
    logger.error(error);
    throw error;
  }
};