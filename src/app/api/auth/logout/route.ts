
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('firebase-session');
  
  // Create a response object to be able to set headers
  const response = NextResponse.json({status: 'success'}, {status: 200});

  // If the cookie exists, tell the browser to delete it
  if (sessionCookie) {
    response.cookies.set({
      name: 'firebase-session',
      value: '',
      maxAge: -1, // Expire the cookie immediately
      path: '/', // Ensure the path matches the one used to set it
    });
  }

  return response;
}
