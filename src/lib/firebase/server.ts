import { getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { credential } from 'firebase-admin';

// This function initializes and returns the Firebase Admin app instance.
// It ensures that the app is initialized only once.
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  // NOTE: This relies on GOOGLE_APPLICATION_CREDENTIALS env var to be set.
  // In a real production environment, you would manage service account keys securely.
  return initializeApp({
    credential: credential.applicationDefault(),
  });
}

const adminApp = getAdminApp();
const adminAuth = getAuth(adminApp);

export { adminApp as app, adminAuth as auth };
