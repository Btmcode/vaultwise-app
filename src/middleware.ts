
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const i18n = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
};

const PUBLIC_FILE = /\.(.*)$/;
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

   // Skip specific paths for performance
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Handle i18n
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // Handle authentication
  const locale = pathname.split('/')[1] || i18n.defaultLocale;
  const sessionCookie = request.cookies.get('firebase-session');
  const pathAfterLocale = pathname.substring(pathname.indexOf('/', 1));
  const isAuthRoute = AUTH_ROUTES.includes(pathAfterLocale);

  if (!sessionCookie && !isAuthRoute) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (sessionCookie && isAuthRoute) {
     return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

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
}
