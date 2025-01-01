import { collection, doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const initializeFirebaseCollections = async () => {
  try {
    // Check if collections are already initialized
    const initDoc = doc(db, '_init', 'status');
    const initSnapshot = await getDoc(initDoc);
    
    if (!initSnapshot.exists()) {
      const batch = writeBatch(db);
      
      // Create initial collections
      const collections = [
        { name: '_init', docId: 'status' },
        { name: 'birthdays', docId: '_init' },
        { name: 'archivedBirthdays', docId: '_init' },
        { name: 'users', docId: 'count' },
        { name: 'roles', docId: 'user' }
      ];
      
      // Initialize each collection
      for (const { name, docId } of collections) {
        const ref = doc(db, name, docId);
        const data = {
          initialized: true,
          createdAt: new Date().toISOString()
        };

        if (name === 'users') {
          data['count'] = 0;
        } else if (name === 'roles') {
          // Create default roles
          batch.set(doc(db, 'roles', 'user'), {
            name: 'user',
            permissions: ['read:birthdays', 'write:birthdays']
          });
          batch.set(doc(db, 'roles', 'admin'), {
            name: 'admin',
            permissions: ['*']
          });
          continue;
        }

        batch.set(ref, data);
      }

      await batch.commit();
      console.log('Firebase collections initialized successfully');
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Firebase collections:', error);
    throw error;
  }
};