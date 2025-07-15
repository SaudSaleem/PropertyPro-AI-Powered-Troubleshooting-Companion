import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Use environment variables if available, otherwise fallback to hardcoded values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDSS0TvskOaljnjjDGkQ0cMuo8wRsL-JxE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "property-pro-d0272.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "property-pro-d0272",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "property-pro-d0272.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1079550751954",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1079550751954:web:0b292283fff2056b04e90b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NQZZVZ5S18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  try {
    // Connect to auth emulator
    if (!auth._delegate._delegate) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    }
    
    // Connect to firestore emulator
    if (!db._delegate._delegate) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
  } catch (error) {
    console.log('Emulator connection error (this is normal if already connected):', error.message);
  }
}

console.log('Firebase initialized with project:', firebaseConfig.projectId);
console.log('Development mode:', import.meta.env.DEV);

export { app, auth, db }; 