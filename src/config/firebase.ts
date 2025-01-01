import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBDubVkq7JjbX1mvAdJEnWfTC9iBxxtJhc",
  authDomain: "birthday-management-ae66f.firebaseapp.com",
  projectId: "birthday-management-ae66f",
  storageBucket: "birthday-management-ae66f.appspot.com",
  messagingSenderId: "36490484361",
  appId: "1:36490484361:web:026a75af66dc8025bf0458",
  measurementId: "G-G0JGGP9L73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };