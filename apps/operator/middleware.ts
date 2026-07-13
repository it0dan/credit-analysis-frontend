import { NextResponse } from 'next/server';
import { auth } from './auth';

export default auth((request) => {
  if (!request.auth || request.auth.user.role !== 'operator') {
    return NextResponse.redirect(new URL('http://localhost:3000/login?error=unauthorized'));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
