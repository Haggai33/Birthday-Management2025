import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { Birthday } from '../../../types/birthday';
import { BIRTHDAYS_COLLECTION } from './constants';
import { enrichBirthdayData } from './utils';

export const getBirthdays = async (): Promise<Birthday[]> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to fetch birthdays');
  }

  try {
    const q = query(
      collection(db, BIRTHDAYS_COLLECTION),
      where('archived', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} birthdays`);
    
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
    console.error('Error fetching birthdays:', error);
    throw error;
  }
};