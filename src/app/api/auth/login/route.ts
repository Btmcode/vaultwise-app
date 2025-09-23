import {NextRequest, NextResponse} from 'next/server';
import {auth} from '@/lib/firebase/server';
import {cookies} from 'next/headers';

// Bu API rotası, istemciden gelen Firebase ID token'ını
// alır ve bunu güvenli, httpOnly bir session cookie'ye dönüştürür.
export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 gün

    try {
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });

      cookies().set('firebase-session', sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: expiresIn,
        path: '/',
      });

      return NextResponse.json({status: 'success'}, {status: 200});
    } catch (error) {
      console.error('Session cookie creation failed:', error);
      return NextResponse.json(
        {error: 'Failed to create session'},
        {status: 401}
      );
    }
  }

  return NextResponse.json({error: 'Unauthorized'}, {status: 401});
}
