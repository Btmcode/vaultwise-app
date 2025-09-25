
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export async function POST() {
  // Create a response object to be able to set headers
  const response = NextResponse.json({status: 'success'}, {status: 200});

  // Instruct the browser to delete the cookie by setting its expiration to a past date.
  // This is the most reliable way to clear a cookie.
  response.cookies.set({
    name: 'firebase-session',
    value: '',
    expires: new Date(0), // Set expiry to a date in the past
    path: '/', // Ensure the path matches the one used to set it
  });

  return response;
}
