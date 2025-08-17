import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { jobs, keywords, location } = await req.json();

    // find keyword id
    const keywordRecord = await prisma.keywords.findFirst({
      where: {
        keywords,
        location,
      },
      select: { id: true },
    });

    if (!keywordRecord) {
      return NextResponse.json(
        { error: "No matching keyword record found" },
        { status: 404 }
      );
    }

    if (!Array.isArray(jobs)) {
      return NextResponse.json(
        { error: "Expected an array of jobs" },
        { status: 400 }
      );
    }
    
    const result = await prisma.job.createMany({
      data: jobs.map((job) => ({
        ...job,
        idkeywords: keywordRecord.id,
      })),
      skipDuplicates: true, // avoids errors if unique constraints repeat
    });

    return NextResponse.json(
      { message: "Jobs inserted successfully", count: result.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting jobs:", error);
    return NextResponse.json(
      { error: "Failed to insert jobs" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    // extract query params
    const { searchParams } = new URL(req.url);
    const keywords = searchParams.get("keywords") || "";
    const location = searchParams.get("location") || "";

    // find keyword id
    const keywordRecord = await prisma.keywords.findFirst({
      where: { keywords, location },
      select: { id: true },
    });

    if (!keywordRecord) {
      return NextResponse.json(
        { error: "No matching keyword record found" },
        { status: 404 }
      );
    }

    const jobs = await prisma.job.findMany({
      where: { idkeywords: keywordRecord.id },
      select: {
        title: true,
        company: true,
        logo_url: true,
        description: true,
        link: true,
        newDescription: true,
        score: true,
      },
    });

    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}