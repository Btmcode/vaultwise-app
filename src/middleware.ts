import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLangs = ['tr', 'en'];
const defaultLang = 'tr';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the path is for a static file, API route, or the root landing page itself.
  // If so, do nothing and let the request proceed.
  const isExcludedPath =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') || // This covers files like favicon.ico, sitemap.xml, etc.
    pathname === '/'; // Exclude the root landing page

  if (isExcludedPath) {
    return NextResponse.next();
  }

  // 2. Check if there is any supported locale in the pathname
  const pathnameHasLocale = supportedLangs.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
     return NextResponse.next();
  }

  // 3. If no locale, redirect to the default locale
  // e.g., incoming request is /dashboard -> redirect to /tr/dashboard
  request.nextUrl.pathname = `/${defaultLang}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
};