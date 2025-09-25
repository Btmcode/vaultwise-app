
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

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Check if we are on the client side and if all necessary config values are present
const isClient = typeof window !== 'undefined';
const hasAllConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

if (isClient && hasAllConfig) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} else if (isClient) {
    // Only warn on the client side if config is missing
    console.warn(
        'Firebase config is incomplete. Firebase services will be disabled on the client. Please check your .env.local file or Netlify environment variables.'
    );
}

export { app, auth, db };
