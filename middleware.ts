import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Protect /makercv route only
  if (pathname.startsWith('/makercv')) {
    const token = req.cookies.get('auth')?.value;

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/makercv/:path*'],
};
