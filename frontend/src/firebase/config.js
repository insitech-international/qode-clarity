// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

// Log environment information without sensitive data
console.log(`Firebase initializing in ${process.env.NODE_ENV} environment`);
console.log(`Using project: ${process.env.REACT_APP_FIREBASE_PROJECT_ID}`);
console.log(
  `Emulator enabled: ${process.env.REACT_APP_USE_FIREBASE_EMULATOR === "true"}`
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Analytics conditionally
let analytics = null;
const initAnalytics = async () => {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.REACT_APP_ENABLE_ANALYTICS === "true"
  ) {
    // Check if analytics is supported in the current environment
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized");
    } else {
      console.log("Firebase Analytics not supported in this environment");
    }
  }
};

// Call the async function
initAnalytics().catch(console.error);

// Connect to emulators if enabled
if (process.env.REACT_APP_USE_FIREBASE_EMULATOR === "true") {
  const host = process.env.REACT_APP_FIREBASE_EMULATOR_HOST || "localhost";
  const firestorePort = process.env.REACT_APP_FIRESTORE_EMULATOR_PORT || "8090";
  const authPort = process.env.REACT_APP_FIREBASE_AUTH_EMULATOR_PORT || "9099";

  console.log(`Connecting to Firestore emulator at ${host}:${firestorePort}`);
  connectFirestoreEmulator(db, host, parseInt(firestorePort));

  console.log(`Connecting to Auth emulator at ${host}:${authPort}`);
  connectAuthEmulator(auth, `http://${host}:${authPort}`);
}

export { app, db, auth, analytics };
