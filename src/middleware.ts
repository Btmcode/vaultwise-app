import {NextRequest, NextResponse} from 'next/server';

const i18n = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
};

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${i18n.defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
