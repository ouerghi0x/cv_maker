import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  const res = new NextResponse(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
  });

  res.headers.set('Set-Cookie', cookie);
  return res;
}
