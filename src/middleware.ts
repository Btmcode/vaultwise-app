
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {getAdminApp} from '@/lib/firebase/server';
import {getAuth} from 'firebase-admin/auth';

const i18n = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
};

const PUBLIC_FILE = /\.(.*)$/;
const AUTH_ROUTES = ['/login', '/signup'];

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
    const locale = i18n.defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // 3. Handle Authentication
  const locale = pathname.split('/')[1] || i18n.defaultLocale;
  const pathAfterLocale = pathname.substring(pathname.indexOf('/', 1));
  const isAuthRoute = AUTH_ROUTES.includes(pathAfterLocale);
  const sessionCookie = request.cookies.get('firebase-session')?.value;

  // If there's no session cookie and the user is trying to access a protected route
  if (!sessionCookie && !isAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // If there is a session cookie, verify it
  if (sessionCookie) {
    try {
      const adminApp = getAdminApp();
      const auth = getAuth(adminApp);
      await auth.verifySessionCookie(sessionCookie, true);

      // If the cookie is valid and the user is on an auth route, redirect to home.
      if (isAuthRoute) {
        return NextResponse.redirect(new URL(`/${locale}/`, request.url));
      }
    } catch (error) {
      // Cookie is invalid (expired, revoked, etc.).
      // If the user is on a protected route, redirect to login.
      // We create a new response to clear the invalid cookie.
      if (!isAuthRoute) {
        const response = NextResponse.redirect(
          new URL(`/${locale}/login`, request.url)
        );
        response.cookies.delete('firebase-session');
        return response;
      }
    }
  }

  // 4. If all checks pass, allow the request to proceed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)',
  ],
};
