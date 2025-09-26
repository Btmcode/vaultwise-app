import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export const runtime = 'nodejs';

const i18n = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
};

const PUBLIC_FILE = /\.(.*)$/;

// This function runs for every request and handles routing logic.
export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // 1. Skip middleware for static files and API routes for performance.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Handle i18n: Redirect if the URL is missing a locale.
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = i1alue;
    if (!sessionCookieValue) {
      // This is a normal case for a logged-out user.
      return null;
    }
    const decodedToken = await auth.verifySessionCookie(sessionCookieValue, true);
    return { uid: decodedToken.uid, email: decodedToken.email };
  } catch (error) {
    // This can happen if the cookie is expired or invalid. Also a normal case.
    console.log("Could not verify session cookie:", error);
    return null;
  }
}
