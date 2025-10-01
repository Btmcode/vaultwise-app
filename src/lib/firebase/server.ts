import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import { cookies } from 'next/headers';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { unstable_noStore as noStore } from 'next/cache';

// A singleton to ensure we only initialize the app once.
let adminApp: App | null = null;

function initializeAdminApp(): App {
  // Return existing app if already initialized
  if (admin.apps.length > 0 && admin.apps[0]) {
      return admin.apps[0];
  }
  
  // This now uses environment variables, which is the secure and correct way.
  // The private key needs special handling to replace newline characters.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Firebase Admin SDK environment variables are not set. Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  };

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return app;
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    throw new Error(
      'Firebase Admin SDK could not be initialized. Check your service account credentials.'
    );
  }
}


// Export a function to get the singleton instance.
export function getAdminApp(): App {
  if (!adminApp) {
    adminApp = initializeAdminApp();
  }
  return adminApp;
}


// This function retrieves and verifies the session cookie and returns the decoded user token.
export async function getCurrentUser(): Promise<DecodedIdToken | null> {
  noStore();
  const sessionCookieValue = cookies().get('firebase-session')?.value;
  
  if (!sessionCookieValue) {
    return null;
  }

  try {
    const adminApp = getAdminApp();
    const auth = admin.auth(adminApp);
    // Set checkRevoked to true to ensure revoked tokens are not accepted.
    const decodedToken = await auth.verifySessionCookie(sessionCookieValue, true);
    return decodedToken;
  } catch (error: any) {
    // This is expected if the cookie is expired or invalid.
    console.log("Could not verify session cookie:", error.code);
    // Clear the invalid cookie to prevent login loops
    cookies().set('firebase-session', '', { maxAge: 0 });
    return null;
  }
}
