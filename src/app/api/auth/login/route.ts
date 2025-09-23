
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

// This function initializes and returns the Firebase Admin App instance.
// It ensures that the app is initialized only once.
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
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
    return initializeApp({
      credential: credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error);
    throw new Error(
      'Firebase Admin SDK could not be initialized. ' + error.message
    );
  }
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json(
      {error: 'Unauthorized: No Bearer token found.'},
      {status: 401}
    );
  }

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
    // Return a more descriptive error to the client
    return NextResponse.json(
      {error: 'Failed to create session', details: error.message},
      {status: 500}
    );
  }
}
