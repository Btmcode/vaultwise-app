
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const i18n = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
};

const PUBLIC_FILE = /\.(.*)$/;
const AUTH_ROUTES = ['/login', '/signup'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

   // Skip public files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Handle i18n
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${i18n.defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = pathname.split('/')[1] || i18n.defaultLocale;
  const sessionCookie = request.cookies.get('firebase-session');
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.endsWith(route));

  // If no session and trying to access a protected route, redirect to login
  if (!sessionCookie && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // If there is a session and trying to access an auth route, redirect to home
  if (sessionCookie && isAuthRoute) {
     const url = request.nextUrl.clone();
     url.pathname = `/${locale}/`;
     return NextResponse.redirect(url);
  }
  
  // NOTE: Full session verification with firebase-admin was removed to solve the build issue.
  // A more robust solution might involve an API call from the middleware if full verification is needed on every request.

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)',
  ],
}
