// GET /api/auth/me
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth')?.value;

  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
