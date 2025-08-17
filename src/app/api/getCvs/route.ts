import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GetUser, sanitizeAIResponse } from "@/lib/logic";
import { Azure_generate } from "@/lib/azureai";

// Utility function to clean the AI response


export async function GET(req: NextRequest) {
  try {
    const {
      isAuthenticated,
      userId,
    }: { isAuthenticated: boolean; userId: number | null } = GetUser(req);

    if (!isAuthenticated || !userId) {
      return NextResponse.json(
        { error: "You are not authenticated." },
        { status: 401 }
      );
    }

    const createdCVCover = await prisma.cV.findMany({
      where: { userId },
      select: {
        id: true,
        cvType: true,
        createdAt: true,
        CoverLatex: true,
        Cvlatex: true,
        pdfcvUrl: true,
        pdfcoverUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const new_prompt = `
    You are an expert at analyzing professional resumes and CVs.
    Extract the most relevant keywords, suggest a single, most fitting professional job title based on the candidate's experience and skills, and identify the primary location from the following LaTeX CV.

    - Keywords: Suggest one title that best fits the candidate’s profile.
    - Location: City and country where the candidate is based.

    Return the result as a single JSON object with the keys: "keywords", "location". Do not include any other text or explanation.

    Example:
    { "keywords": "AI/Fullstack Software Engineer", "location": "Tunis, Tunisia" }

    Data:
    `;

    const cvsWithKeywords = await Promise.all(
      createdCVCover.map(async (data) => {
        // Skip if no LaTeX CV exists
        if (!data.Cvlatex) {
          return { ...data, keywords: null, location: null };
        }

        // Check if keywords already exist
        const keyword_exist = await prisma.keywords.findUnique({
          where: { cvid: data.id },
          select: { keywords: true, location: true },
        });

        if (keyword_exist) {
          return { ...data, ...keyword_exist };
        }

        // Otherwise → generate and save
        try {
          const aiResponse = await Azure_generate(new_prompt, data.Cvlatex);
          const parsed = sanitizeAIResponse(aiResponse || "");
          if (parsed?.keywords && parsed?.location) {
            const { keywords, location } = parsed;
            await prisma.keywords.create({
              data: {
                cvid: data.id,
                keywords,
                location,
              },
            });
            return { ...data, keywords, location };
          }
        } catch (error) {
          console.error("Failed to parse AI response:", error);
        }

        return { ...data, keywords: null, location: null };
      })
    );

    return NextResponse.json({ cvCover: cvsWithKeywords });
  } catch (error) {
    console.error("Failed to fetch CV/Cover data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data." },
      { status: 500 }
    );
  }
}
