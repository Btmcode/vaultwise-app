
import {NextResponse} from 'next/server';

export async function POST() {
  // Create a response object to be able to set headers
  const response = NextResponse.json({status: 'success'}, {status: 200});

  // The options for clearing the cookie MUST match the options used to set it.
  const options = {
    name: 'firebase-session',
    value: '',
    maxAge: 0,
    expires: new Date(0), // Set expiry to a past date
    httpOnly: true,
    secure: true,
    path: '/',
  };

  // Instruct the browser to delete the cookie by setting an expired cookie with the same properties.
  response.cookies.set(options);

  return response;
}
