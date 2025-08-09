import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GetUser } from "@/lib/logic";

export async function GET(req: NextRequest) {
  try {
    const { isAuthenticated, userId }: { isAuthenticated: boolean; userId: number | null } =  GetUser(req);
    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: "You are not authenticated." },
        { status: 401 } // 401 Unauthorized instead of 500
      );
    }

    const createdCVCover = await prisma.cV.findMany({
      where: { userId },
      select: {
        id:true,
        cvType:true,
        createdAt:true,
        CoverLatex: true,   
        Cvlatex: true,
        pdfcvUrl: true,
        pdfcoverUrl: true,
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    return NextResponse.json({ cvCover: createdCVCover });
  } catch (error) {
    console.error("Failed to fetch CV/Cover data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data." },
      { status: 500 }
    );
  }
}
