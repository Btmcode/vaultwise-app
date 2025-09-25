
import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// This is the standard and most reliable way to handle public env variables in Next.js
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This function ensures Firebase is initialized only once (singleton pattern)
// and only on the client-side.
function initializeFirebase() {
  const isClient = typeof window !== 'undefined';
  if (!isClient) return;

  // Check if all necessary config values are present before initializing
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    if (!getApps().length) {
      // No apps initialized, so initialize a new one.
      app = initializeApp(firebaseConfig);
    } else {
      // Use the already initialized app.
      app = getApp();
    }
    
    auth = getAuth(app);
    db = getFirestore(app);

  } else {
    console.warn(
      'Firebase config is incomplete. Firebase services will be disabled on the client. Please check your .env file or Netlify environment variables.'
    );
  }
}

// Initialize on first load
initializeFirebase();

export { app, auth, db };
