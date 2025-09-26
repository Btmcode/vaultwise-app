
import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function getFirebaseServices() {
  const isClient = typeof window !== 'undefined';
  if (!isClient) {
    // Return a dummy object or handle server-side logic if needed,
    // but for client-only firebase, we can return nulls.
    // However, our `firestore.ts` is a server module, so we need a different approach.
    // The best approach is to have a single initialization pattern.
  }

  let app: FirebaseApp;
  if (!getApps().length) {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig);
    } else {
      console.warn(
        'Firebase config is incomplete. Firebase services will be disabled. Please check your .env file or environment variables.'
      );
      // Return null or throw an error if config is essential
      return { app: null, auth: null, db: null };
    }
  } else {
    app = getApp();
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  return { app, auth, db };
}

// We will export the function to be called, rather than the instances.
// This ensures initialization logic is run on demand.
const { app, auth, db } = getFirebaseServices();
export { app, auth, db, getFirebaseServices };
