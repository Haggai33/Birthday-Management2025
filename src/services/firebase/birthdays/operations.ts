import { collection, doc, writeBatch, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase';
import { BIRTHDAYS_COLLECTION } from './constants';

export const verifyBirthdayDocuments = async (ids: string[]) => {
  console.log('Verifying birthday documents:', ids);
  
  const verificationPromises = ids.map(async id => {
    const docRef = doc(db, BIRTHDAYS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return { id, exists: docSnap.exists() };
  });

  const verificationResults = await Promise.all(verificationPromises);
  const nonExistentIds = verificationResults
    .filter(result => !result.exists)
    .map(result => result.id);

  if (nonExistentIds.length > 0) {
    throw new Error(`Birthdays not found: ${nonExistentIds.join(', ')}`);
  }

  return true;
};

export const performBatchDelete = async (ids: string[]) => {
  console.log('Performing batch delete for IDs:', ids);
  
  const batch = writeBatch(db);
  ids.forEach(id => {
    const birthdayRef = doc(db, BIRTHDAYS_COLLECTION, id);
    batch.delete(birthdayRef);
  });

  await batch.commit();
  console.log('Batch delete completed successfully');
};