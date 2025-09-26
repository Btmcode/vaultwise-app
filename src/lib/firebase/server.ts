
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once.
export function getAdminApp(): App {
  // Check if the default app is already initialized
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // The private key must have its newlines properly formatted.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error(
      'Firebase Admin SDK environment variables are not set. Check FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID.'
    );
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Rethrow a more specific error to be caught later
    throw new Error(
      'Firebase Admin SDK could not be initialized. ' + error.message
    );
  }
}
