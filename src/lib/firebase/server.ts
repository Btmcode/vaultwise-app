
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once across the entire server.
export function getAdminApp(): App {
  // If the default app is already initialized, return it.
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // The private key must have its newlines properly escaped in the .env file.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin SDK environment variables are not set. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  try {
    // Initialize the default app.
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
