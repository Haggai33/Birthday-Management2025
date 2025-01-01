import { collection, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { UserRole } from './types';

const ROLES_COLLECTION = 'roles';

export const getRoles = async (): Promise<UserRole[]> => {
  const snapshot = await getDocs(collection(db, ROLES_COLLECTION));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as UserRole[];
};

export const getRole = async (roleId: string): Promise<UserRole | null> => {
  const roleRef = doc(db, ROLES_COLLECTION, roleId);
  const roleSnap = await getDoc(roleRef);
  
  if (roleSnap.exists()) {
    return {
      id: roleSnap.id,
      ...roleSnap.data()
    } as UserRole;
  }
  return null;
};

export const createRole = async (role: Omit<UserRole, 'id'>): Promise<UserRole> => {
  const roleRef = doc(collection(db, ROLES_COLLECTION));
  await setDoc(roleRef, {
    ...role,
    createdAt: new Date().toISOString()
  });
  
  return {
    id: roleRef.id,
    ...role
  };
};

export const updateRole = async (
  roleId: string,
  data: Partial<UserRole>
): Promise<void> => {
  const roleRef = doc(db, ROLES_COLLECTION, roleId);
  await setDoc(roleRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};