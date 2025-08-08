import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth')?.value;

  if (!token) {
    return NextResponse.json({ cvs: [] }, { status: 200 });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };

    const cvs = await prisma.cV.findMany({
      where: {
        userId: payload.userId,
      },
      select: {
        id: true,
        cvType: true,
        jobPost: true,
        pdfcvUrl: true,
        pdfcoverUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ cvs });
