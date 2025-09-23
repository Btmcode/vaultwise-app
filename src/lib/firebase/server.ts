import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { credential } from 'firebase-admin';

// Bu fonksiyon, sunucu tarafında Firebase Admin SDK'yı başlatır.
// Middleware gibi sunucu ortamlarında kullanılır.
const app = !getApps().length
  ? initializeApp({
      credential: credential.applicationDefault(),
    })
  : getApp();

const auth = () => getAuth(app);

export { app, auth };
