import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { convertGregorianToHebrew, getNextHebrewBirthdays } from '../hebcal';
import type { Birthday, NewBirthday } from '../../types/birthday';

const BIRTHDAYS_COLLECTION = 'birthdays';
const ARCHIVED_COLLECTION = 'archivedBirthdays';

export const getBirthdays = async (): Promise<Birthday[]> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to fetch birthdays');
  }

  const q = query(
    collection(db, BIRTHDAYS_COLLECTION),
    where('archived', '==', false)
  );
  
  const querySnapshot = await getDocs(q);
  const birthdays = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const birthDate = new Date(data.birthDate);
      const hebrewDate = await convertGregorianToHebrew(birthDate, data.afterSunset);
      const nextBirthdays = await getNextHebrewBirthdays(birthDate, data.afterSunset);
      
      return {
        id: doc.id,
        ...data,
        hebrewDate: hebrewDate.hebrew,
        nextBirthday: nextBirthdays[0]?.toISOString(),
        nextBirthdays: nextBirthdays.map(date => date.toISOString()),
        age: new Date().getFullYear() - birthDate.getFullYear(),
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      } as Birthday;
    })
  );
  
  return birthdays;
};

export const getArchivedBirthdays = async (): Promise<Birthday[]> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to fetch archived birthdays');
  }

  const q = query(collection(db, ARCHIVED_COLLECTION));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Birthday[];
};

export const addBirthday = async (data: NewBirthday): Promise<Birthday> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to add birthdays');
  }

  const birthDate = new Date(data.birthDate);
  const hebrewDate = await convertGregorianToHebrew(birthDate, data.afterSunset);
  const nextBirthdays = await getNextHebrewBirthdays(birthDate, data.afterSunset);
  
  const birthdayData = {
    ...data,
    createdBy: auth.currentUser.uid,
    archived: false,
    isDuplicate: false,
    duplicateVerified: false,
    needsGenderVerification: !data.gender,
    needsSunsetVerification: data.afterSunset === undefined,
    hebrewDate: hebrewDate.hebrew,
    nextBirthday: nextBirthdays[0]?.toISOString(),
    nextBirthdays: nextBirthdays.map(date => date.toISOString()),
    age: new Date().getFullYear() - birthDate.getFullYear(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, BIRTHDAYS_COLLECTION), birthdayData);
  
  return {
    id: docRef.id,
    ...birthdayData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } as Birthday;
};

export const updateBirthday = async (id: string, data: Partial<NewBirthday>): Promise<Birthday> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to update birthdays');
  }

  const birthdayRef = doc(db, BIRTHDAYS_COLLECTION, id);
  const birthdaySnap = await getDoc(birthdayRef);
  
  if (!birthdaySnap.exists()) {
    throw new Error('Birthday not found');
  }

  const currentData = birthdaySnap.data();
  const birthDate = new Date(data.birthDate || currentData.birthDate);
  const hebrewDate = await convertGregorianToHebrew(birthDate, data.afterSunset ?? currentData.afterSunset);
  const nextBirthdays = await getNextHebrewBirthdays(birthDate, data.afterSunset ?? currentData.afterSunset);

  const updateData = {
    ...data,
    hebrewDate: hebrewDate.hebrew,
    nextBirthday: nextBirthdays[0]?.toISOString(),
    nextBirthdays: nextBirthdays.map(date => date.toISOString()),
    age: new Date().getFullYear() - birthDate.getFullYear(),
    updatedAt: serverTimestamp()
  };

  await updateDoc(birthdayRef, updateData);

  return {
    id,
    ...currentData,
    ...updateData,
    updatedAt: new Date().toISOString()
  } as Birthday;
};

export const deleteBirthdays = async (ids: string[]): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to delete birthdays');
  }

  const batch = writeBatch(db);
  ids.forEach(id => {
    const docRef = doc(db, BIRTHDAYS_COLLECTION, id);
    batch.delete(docRef);
  });

  await batch.commit();
};

export const archiveBirthday = async (id: string): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to archive birthdays');
  }

  const birthdayRef = doc(db, BIRTHDAYS_COLLECTION, id);
  const birthdaySnap = await getDoc(birthdayRef);
  
  if (!birthdaySnap.exists()) {
    throw new Error('Birthday not found');
  }

  const birthdayData = birthdaySnap.data();
  const batch = writeBatch(db);

  // Add to archived collection
  const archivedRef = doc(collection(db, ARCHIVED_COLLECTION));
  batch.set(archivedRef, {
    ...birthdayData,
    archived: true,
    archivedAt: serverTimestamp()
  });

  // Delete from main collection
  batch.delete(birthdayRef);

  await batch.commit();
};

export const restoreBirthday = async (id: string): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to restore birthdays');
  }

  const archivedRef = doc(db, ARCHIVED_COLLECTION, id);
  const archivedSnap = await getDoc(archivedRef);
  
  if (!archivedSnap.exists()) {
    throw new Error('Archived birthday not found');
  }

  const birthdayData = archivedSnap.data();
  const batch = writeBatch(db);

  // Add back to main collection
  const birthdayRef = doc(collection(db, BIRTHDAYS_COLLECTION));
  batch.set(birthdayRef, {
    ...birthdayData,
    archived: false,
    restoredAt: serverTimestamp()
  });

  // Delete from archived collection
  batch.delete(archivedRef);

  await batch.commit();
};