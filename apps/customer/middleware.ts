import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (!request.auth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  if (request.auth.user.role === 'operator') {
    return NextResponse.redirect(new URL('http://localhost:3001'));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
