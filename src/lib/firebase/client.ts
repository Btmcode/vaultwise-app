
import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import getConfig from 'next/config';

// Fallback for process.env
const { publicRuntimeConfig } = getConfig() || {};

const firebaseConfig: FirebaseOptions = {
  apiKey: publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: publicRuntimeConfig?.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This function ensures Firebase is initialized only once (singleton pattern)
// and only on the client-side.
function initializeFirebase() {
  const isClient = typeof window !== 'undefined';
  if (!isClient) return;

  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
  } else {
    // Check if all necessary config values are present before initializing
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig);
    } else {
      console.warn(
        'Firebase config is incomplete. Firebase services will be disabled on the client. Please check your .env file or Netlify environment variables.'
      );
      // Do not proceed if config is missing
      return;
    }
  }

  auth = getAuth(app);
  db = getFirestore(app);
}

// Initialize on first load
initializeFirebase();

export { app, auth, db };
