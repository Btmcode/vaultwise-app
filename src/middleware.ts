
export const runtime = 'nodejs';

import {NextRequest, NextResponse} from 'next/server';
import {auth} from '@/lib/firebase/server'; // Sunucu tarafı Firebase'i içe aktar

const i18n = {
  locales: ['tr', 'en'],
  defaultLocale: 'tr',
};

// Bu yolların yerelleştirme middleware'inden geçmesini istemiyoruz
const PUBLIC_FILE = /\.(.*)$/;
const AUTH_ROUTES = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Statik dosyaları ve _next isteklerini atla
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Locale kontrolü ve yönlendirmesi
  const pathnameHasLocale = i18n.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${i18n.defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // --- Kimlik Doğrulama Mantığı ---
  const locale = pathname.split('/')[1] || i18n.defaultLocale;
  const session = request.cookies.get('firebase-session')?.value;

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.endsWith(route));

  // Eğer oturum yoksa ve korumalı bir sayfaya erişmeye çalışıyorsa
  if (!session && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Eğer oturum varsa ve giriş/kayıt sayfasına gitmeye çalışıyorsa
  if (session) {
    try {
      // Oturumun geçerliliğini sunucu tarafında doğrula
      await auth().verifySessionCookie(session, true);

      if (isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Oturum geçersizse, cookie'yi temizle ve giriş sayfasına yönlendir
      console.error('Session verification error:', error);
      const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      response.cookies.delete('firebase-session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)',
  ],
};
