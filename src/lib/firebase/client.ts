
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

// This function is for CLIENT-SIDE usage only.
function getFirebaseServices() {
  let app: FirebaseApp;
  if (!getApps().length) {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig);
    } else {
      console.warn(
        'Firebase config is incomplete. Client-side Firebase services will be disabled.'
      );
      return { app: null, auth: null, db: null };
    }
  } else {
    app = getApp();
  }

  const auth = getAuth(app);
  const db = getFirestore(app);

  return { app, auth, db };
}

// Destructure and export for easy client-side use
const { app, auth, db } = getFirebaseServices();
export { app, auth, db };
