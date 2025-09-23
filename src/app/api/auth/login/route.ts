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

config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

function getAdminApp(): App {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (getApps().length > 0) {
    return getApp();
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin SDK environment variables. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
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
    console.error('Firebase Admin SDK initialization error:', error.message);
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
    return NextResponse.json(
      {error: 'Failed to create session', details: error.message},
      {status: 500}
    );
  }
}
