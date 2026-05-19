import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, remove, update } from 'firebase/database';

// Firebase Configuration
// يجب تغيير هذه القيم بقيم مشروعك من Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDemo-REPLACE-WITH-YOUR-KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return !firebaseConfig.apiKey.includes('REPLACE') && 
         !firebaseConfig.projectId.includes('your-project');
};

// Initialize Firebase
let app: any = null;
let database: any = null;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  }
} catch (error) {
  console.log('Firebase not configured yet');
}

export { app, database, ref, set, get, onValue, remove, update };

// Helper to get Firebase config from localStorage (for dynamic setup)
export const getStoredFirebaseConfig = () => {
  try {
    const config = localStorage.getItem('arena_firebase_config');
    return config ? JSON.parse(config) : null;
  } catch {
    return null;
  }
};

export const setStoredFirebaseConfig = (config: typeof firebaseConfig) => {
  localStorage.setItem('arena_firebase_config', JSON.stringify(config));
};
