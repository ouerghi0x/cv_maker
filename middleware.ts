import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect only /makercv routes
  if (pathname.startsWith('/makercv')) {
    const token = req.cookies.get('auth')?.value;

    // Redirect if no token present
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    try {
      // Verify token and get payload safely
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number };

      if (!payload.userId) {
        throw new Error('Invalid token payload');
      }

      const user = await prisma.user.findUnique({ where: { id: payload.userId } });

      if (!user) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }

      if (!user.hasSubscription && user.freeTrialUsed < 1) {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    } catch (error) {
      // On any error (invalid token, db error), redirect to login
      console.log(error)
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // If path is not matched, continue as normal
  return NextResponse.next();
}

// Specify matcher for routes to apply middleware
export const config = {
  matcher: ['/makercv/:path*'],
};
