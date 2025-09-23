import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {
  initializeApp,
  getApps,
  getApp,
  credential,
  App,
} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {config} from 'dotenv';

// Load environment variables from .env file
config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Initialize Firebase Admin SDK
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  try {
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      privateKey
    ) {
      return initializeApp({
        credential: credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return initializeApp({
        credential: credential.applicationDefault(),
      });
    } else {
      console.error(`
********************************************************************************
Firebase Admin SDK initialization failed. 
Missing one or more required environment variables:
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
Alternatively, set GOOGLE_APPLICATION_CREDENTIALS.
********************************************************************************`);
      throw new Error('Firebase Admin SDK initialization failed: Missing environment variables.');
    }
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Re-throw the error to ensure the calling function knows about the failure.
    throw error;
  }
}

// This API route takes the Firebase ID token from the client,
// verifies it, and sets a secure, httpOnly session cookie.
export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
      const adminApp = getAdminApp();
      const adminAuth = getAuth(adminApp);
      const sessionCookie = await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      });

      cookies().set('firebase-session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn,
        path: '/',
      });

      return NextResponse.json({status: 'success'}, {status: 200});
    } catch (error: any) {
      console.error('Full Session cookie creation error:', error);
      return NextResponse.json(
        {error: 'Failed to create session', details: error.message},
        {status: 401}
      );
    }
  }

  return NextResponse.json({error: 'Unauthorized'}, {status: 401});
}
