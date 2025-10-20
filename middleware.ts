import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie
  const sessionCookie = request.cookies.get('session');

  // If accessing login page and has valid session, redirect to home
  if (pathname === '/login') {
    if (sessionCookie) {
      try {
        jwt.verify(sessionCookie.value, JWT_SECRET);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        console.log(error)
        // Invalid token, allow access to login
      }
    }
    return NextResponse.next();
  }

  // Allow access to API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // For other pages, require authentication
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify JWT
  try {
    jwt.verify(sessionCookie.value, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};