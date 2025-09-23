import { getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { credential } from 'firebase-admin';
import { config } from 'dotenv';

config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  // Check if environment variables are available for service account credentials
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    return initializeApp({
      credential: credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } 
  // Fallback to application default credentials
  else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
     return initializeApp({
        credential: credential.applicationDefault(),
     });
  }
  else {
    console.warn(
`********************************************************************************
Firebase Admin SDK initialization failed. 
Please either set the GOOGLE_APPLICATION_CREDENTIALS environment variable
or set the FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY
environment variables to initialize the SDK.
********************************************************************************`
    );
    // Return a dummy app or throw an error if you want to enforce initialization
    // For now, we let it fail later when auth() is called.
    return initializeApp();
  }
}

const adminApp = getAdminApp();
const adminAuth = getAuth(adminApp);

export { adminApp as app, adminAuth as auth };
