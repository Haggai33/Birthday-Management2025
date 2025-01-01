import { doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { UserProfile, UserSettings } from './types';

export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

export const updateUserStatus = async (
  userId: string,
  status: UserProfile['status']
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    status,
    updatedAt: new Date().toISOString()
  });
};

export const deleteUser = async (userId: string): Promise<void> => {
  // First, update user status to inactive
  await updateUserStatus(userId, 'inactive');
  
  // Then move to deleted_users collection
  const userRef = doc(db, 'users', userId);
  const deletedRef = doc(db, 'deleted_users', userId);
  
  const userData = (await userRef.get()).data();
  await setDoc(deletedRef, {
    ...userData,
    deletedAt: new Date().toISOString()
  });
  
  // Finally, delete from users collection
  await deleteDoc(userRef);
};

export const updateUserSettings = async (
  settings: UserSettings
): Promise<void> => {
  const settingsRef = doc(db, 'user_settings', settings.userId);
  await setDoc(settingsRef, {
    ...settings,
    updatedAt: new Date().toISOString()
  });
};