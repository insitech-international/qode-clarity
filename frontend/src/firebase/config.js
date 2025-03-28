// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator
} from 'firebase/firestore';
import {
  getAuth,
  connectAuthEmulator
} from 'firebase/auth';
import {
  getAnalytics
} from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Analytics (only in production environment)
let analytics = null;
if (process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}

// Connect to emulators if in development mode
if (process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  const host = process.env.REACT_APP_FIREBASE_EMULATOR_HOST || 'localhost';
  const firestorePort = process.env.REACT_APP_FIRESTORE_EMULATOR_PORT || '8090';
  const authPort = process.env.REACT_APP_AUTH_EMULATOR_PORT || '9099';

  console.log(`Connecting to Firestore emulator at ${host}:${firestorePort}`);
  connectFirestoreEmulator(db, host, parseInt(firestorePort));

  console.log(`Connecting to Auth emulator at ${host}:${authPort}`);
  connectAuthEmulator(auth, `http://${host}:${authPort}`);
}

export { app, db, auth, analytics };