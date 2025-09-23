import {NextRequest, NextResponse} from 'next/server';

const i18n = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
};

// Bu yolların yerelleştirme middleware'inden geçmesini istemiyoruz
const PUBLIC_FILE = /\.(.*)$/;
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  
  // Statik dosyaları ve _next isteklerini atla
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Auth yollarını doğrudan yeniden yönlendir, /tr/login gibi
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.includes(route));
  if (isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${i18n.defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Diğer tüm yollar için
  const url = request.nextUrl.clone();
  url.pathname = `/${i18n.defaultlocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
