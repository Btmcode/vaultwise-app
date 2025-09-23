
import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';

// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once.
function getAdminApp(): App {
  if (admin.apps.length > 0) {
    return admin.app();
  }

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
    console.error('Firebase Admin SDK initialization error:', error);
    // Rethrow the original error with a more descriptive message
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

    // For production, use the root domain and set maxAge for persistence.
    const requestUrl = new URL(request.url);
    // For localhost, domain will be 'localhost'. For cloud env, it will be the root domain.
    const domain = isDevelopment ? 'localhost' : requestUrl.hostname.split('.').slice(-2).join('.');

    const cookieOptions: any = {
        httpOnly: true,
        secure: !isDevelopment,
        path: '/',
        domain: domain,
        maxAge: isDevelopment ? undefined : expiresIn,
    };
    
    // In development, we might not want to set domain for simplicity if it causes issues.
    if (isDevelopment && requestUrl.hostname === 'localhost') {
        delete cookieOptions.domain;
    }

    cookies().set('firebase-session', sessionCookie, cookieOptions);

    return NextResponse.json({status: 'success'}, {status: 200});
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
