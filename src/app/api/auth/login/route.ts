
import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once.
function getAdminApp(): App {
  if (admin.apps.length > 0) {
    const existingApp = admin.apps.find(app => app?.name === 'admin');
    if(existingApp) return existingApp;
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
    }, 'admin');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
    // Rethrow a more specific error to be caught later
    throw new Error(
      'Firebase Admin SDK could not be initialized. ' + error.message
    );
  }
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json(
      {error: 'Unauthorized', details: 'No Bearer token found.'},
      {status: 401}
    );
  }

  const idToken = authorization.split('Bearer ')[1];
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const adminApp = getAdminApp();
    const adminAuth = admin.auth(adminApp);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    
    const isDevelopment = process.env.NODE_ENV === 'development';
    const requestUrl = new URL(request.url);

    const cookieOptions: any = {
        name: 'firebase-session',
        value: sessionCookie,
        httpOnly: true,
        secure: true, // Secure must be true for SameSite=None
        path: '/',
        sameSite: 'None', // Allow cross-site cookie usage for iframe
    };
    
    // For production, set domain and maxAge for persistence.
    // For development, we leave them out to use a session cookie scoped to the current domain.
    if (!isDevelopment) {
        cookieOptions.domain = requestUrl.hostname.split('.').slice(-2).join('.');
        cookieOptions.maxAge = expiresIn;
    }
    
    const response = NextResponse.json({status: 'success'}, {status: 200});
    response.cookies.set(cookieOptions);

    return response;

  } catch (error: any)
   {
    console.error('Full Session cookie creation error:', error);
    // Return a more descriptive error to the client
    return NextResponse.json(
      {error: 'Failed to create session', details: error.message},
      {status: 500}
    );
  }
}
