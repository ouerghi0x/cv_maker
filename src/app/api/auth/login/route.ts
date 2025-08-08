import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

if (process.env.NODE_ENV !== 'production' && JWT_SECRET === 'dev-secret') {
  console.warn('WARNING: Using default JWT_SECRET in development!');
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const response = NextResponse.json({ message: 'Logged in' });

    // Determine if secure cookie flag should be set
    const isProduction = process.env.NODE_ENV === 'production';

    response.headers.set(
      'Set-Cookie',
      serialize('auth', token, {
        httpOnly: true,
        secure: isProduction, // only set secure flag in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // for older browsers
        path: '/',
      })
    );

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
