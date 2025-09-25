
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
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
let app;
let auth: Auth;
let db: Firestore;

// Check if we are on the client side and if all necessary config values are present
if (typeof window !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // On the server or if config is missing, provide dummy instances or handle appropriately
    if (typeof window !== 'undefined') {
        console.warn(
            'Firebase config is incomplete. Firebase services will be disabled on the client. Please check your .env.local file or Netlify environment variables.'
        );
    }
    app = undefined;
    auth = {} as Auth; // Dummy object
    db = {} as Firestore; // Dummy object
}


export { app, auth, db };
