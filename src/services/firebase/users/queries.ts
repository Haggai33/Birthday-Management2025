import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import type { UserProfile } from './types';

const USERS_PER_PAGE = 10;

export const getUsersByRole = async (role: string): Promise<UserProfile[]> => {
  const q = query(
    collection(db, 'users'),
    where('role', '==', role),
    where('status', '==', 'active')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as UserProfile[];
};

export const getPaginatedUsers = async (
  lastDoc?: DocumentSnapshot
): Promise<{ users: UserProfile[]; lastDoc: DocumentSnapshot | null }> => {
  let q = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc'),
    limit(USERS_PER_PAGE)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const users = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as UserProfile[];

  return {
    users,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
  };
};

export const searchUsers = async (searchTerm: string): Promise<UserProfile[]> => {
  const q = query(
    collection(db, 'users'),
    where('status', '==', 'active'),
    orderBy('firstName'),
    where('firstName', '>=', searchTerm),
    where('firstName', '<=', searchTerm + '\uf8ff'),
    limit(10)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as UserProfile[];
};