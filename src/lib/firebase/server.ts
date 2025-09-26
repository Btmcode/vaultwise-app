
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once across the entire server.
export function getAdminApp(): App {
  // If the default app is already initialized, return it.
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }
  
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error(
      'Firebase Admin SDK environment variable FIREBASE_SERVICE_ACCOUNT_KEY is not set.'
    );
  }

  try {
    // Initialize the default app.
    return admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Rethrow a more specific error to be caught later
    throw new Error(
      'Firebase Admin SDK could not be initialized. ' + error.message
    );
  }
}
