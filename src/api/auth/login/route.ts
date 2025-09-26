
import {NextRequest, NextResponse} from 'next/server';
import admin from 'firebase-admin';
import { getAdminApp } from '@/lib/firebase/server'; // Import the centralized function

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
    // Use the centralized and consistent getAdminApp function
    const adminApp = getAdminApp();
    const adminAuth = admin.auth(adminApp);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
    
    // Standardized cookie options
    const options = {
        name: 'firebase-session',
        value: sessionCookie,
        maxAge: expiresIn / 1000, // maxAge is in seconds
        httpOnly: true,
        secure: true,
        path: '/',
    };
    
    const response = NextResponse.json({status: 'success'}, {status: 200});
    response.cookies.set(options);

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
