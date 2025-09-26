
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import { cookies } from 'next/headers';
import type { DecodedIdToken } from 'firebase-admin/auth';

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


// This function retrieves and verifies the session cookie and returns the decoded user token.
export async function getCurrentUser(): Promise<DecodedIdToken | null> {
  const sessionCookieValue = cookies().get('firebase-session')?.value;
  
  if (!sessionCookieValue) {
    // This is a normal case for a logged-out user.
    return null;
  }

  try {
    const adminApp = getAdminApp();
    const auth = admin.auth(adminApp);
    const decodedToken = await auth.verifySessionCookie(sessionCookieValue, true);
    return decodedToken;
  } catch (error) {
    // This can happen if the cookie is expired or invalid. Also a normal case.
    console.log("Could not verify session cookie (it might be expired or invalid):", error);
    // Clear the invalid cookie to prevent login loops
    cookies().delete('firebase-session');
    return null;
  }
}
