import { Azure_generate } from "@/lib/azureai";
import { sanitizeAIResponse } from "@/lib/logic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, description } = await req.json();

    const responseString = await Azure_generate(prompt, description);
    const parsed = sanitizeAIResponse(responseString || "");

    const newDescription = parsed?.newDescription || "No summary available";
    const score =
      parseInt((parsed?.score || "0%").replace("%", ""), 10) || 0;

    return NextResponse.json({
      newDescription,
      score,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
