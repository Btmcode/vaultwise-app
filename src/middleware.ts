import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const supportedLangs = ['tr', 'en'];
const defaultLang = 'tr';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  
  try {
    return match(languages, supportedLangs, defaultLang);
  } catch (e) {
    return defaultLang;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API ve framework dosyalarını atla
  const isExcludedPath =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.');

  if (isExcludedPath) {
    return NextResponse.next();
  }

  // 2. Patika'da dil var mı kontrol et
  const pathnameHasLocale = supportedLangs.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3. Dil yoksa, tarayıcı diline göre yönlendir
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Kök yol dahil tüm yolları kapsa, hariç tutulanları negatif lookahead ile belirt
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};