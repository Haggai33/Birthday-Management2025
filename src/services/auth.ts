import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User, LoginData, RegisterData } from '../types/auth';

export const createUserProfile = async (
  firebaseUser: FirebaseUser,
  userData: Omit<User, 'id'>
): Promise<void> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  await setDoc(userRef, {
    ...userData,
    id: firebaseUser.uid,
    email: firebaseUser.email,
    createdAt: new Date().toISOString()
  });
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  return null;
};

export const registerUser = async (data: RegisterData): Promise<User> => {
  const { email, password, firstName, lastName } = data;
  
  // Check if this is the first user (will be admin)
  const userRef = doc(db, 'users', 'count');
  const userCount = await getDoc(userRef);
  const isFirstUser = !userCount.exists();
  
  // Create Firebase auth user
  const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user profile
  const userData: Omit<User, 'id'> = {
    email,
    firstName,
    lastName,
    role: isFirstUser ? 'admin' : 'user'
  };
  
  await createUserProfile(firebaseUser, userData);
  
  // Update user count
  await setDoc(userRef, { count: isFirstUser ? 1 : userCount.data()?.count + 1 });
  
  return {
    id: firebaseUser.uid,
    ...userData
  };
};

export const loginUser = async ({ email, password }: LoginData): Promise<User> => {
  const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
  const userProfile = await getUserProfile(firebaseUser.uid);
  
  if (!userProfile) {
    throw new Error('User profile not found');
  }
  
  return userProfile;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        unsubscribe();
        if (firebaseUser) {
          const userProfile = await getUserProfile(firebaseUser.uid);
          resolve(userProfile);
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
};