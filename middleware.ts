import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

/**
 * Penjaga halaman /admin. Route handler di /api tetap memeriksa sesinya
 * sendiri, jadi ini murni soal redirect halaman.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';

  let authed = false;
  try {
    authed = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  } catch {
    // AUTH_SECRET belum diset -> anggap belum login.
    authed = false;
  }

  if (!authed && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (authed && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
