
import {NextRequest, NextResponse} from 'next/server';
import {auth} from '@/lib/firebase/server';

const i18n = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
};

const PUBLIC_FILE = /\.(.*)$/;
const AUTH_ROUTES = ['/login', '/signup'];

export default async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${i18n.defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = pathname.split('/')[1] || i18n.defaultLocale;
  const session = request.cookies.get('firebase-session')?.value;

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.endsWith(route));

  if (!session && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  if (session) {
    try {
      await auth().verifySessionCookie(session, true);

      if (isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Session verification error:', error);
      const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      response.cookies.delete('firebase-session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)',
  ],
};
