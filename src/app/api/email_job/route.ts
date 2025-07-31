import genAI from "@/lib/ai";
import { promptIA } from "@/lib/prompt";
import { GeneratedEmailOutput } from "@/lib/type";
import { NextRequest, NextResponse } from "next/server";




const promptIntro: string = promptIA.prompt_generate_job_application_email;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const input = await req.json();
    const model = genAI;

    let aiRawResponse: string;
    try {
      const result = await model.generateContent(
        `${promptIntro}\n\n${input.data}`
      );
      aiRawResponse = result.response.text();
      // Remove markdown code block fences (```json) if the AI includes them
      aiRawResponse = aiRawResponse.replace(/```json|```/gi, "").trim();
    } catch (aiError: unknown) {
      console.error("AI email generation error:", aiError);
      return NextResponse.json(
        {
          error: "Failed to generate email content from AI.",
          details:
            aiError instanceof Error ? aiError.message : "Unknown AI error",
        },
        { status: 500 }
      );
    }

    if (!aiRawResponse) {
      return NextResponse.json(
        { error: "AI generated an empty response." },
        { status: 500 }
      );
    }

    let parsedEmail: GeneratedEmailOutput;
    try {
      parsedEmail = JSON.parse(aiRawResponse);
      // Basic validation to ensure the parsed object has the expected keys
      if (!parsedEmail.subject || !parsedEmail.body || !parsedEmail.to) {
        throw new Error("Missing expected fields in AI's JSON output.");
      }
    } catch (parseError: unknown) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw AI response:", aiRawResponse); // Log raw response for debugging
      return NextResponse.json(
        {
          error: "Failed to parse AI's response into a valid email structure.",
          details:
            parseError instanceof Error
              ? parseError.message
              : "Invalid JSON format from AI.",
          rawResponse: aiRawResponse, // Include raw response for debugging on client side
        },
        { status: 500 }
      );
    }

    // Return the parsed JSON object
    return NextResponse.json(parsedEmail, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (overallError: unknown) {
    console.error("An unexpected error occurred:", overallError);
    return NextResponse.json(
      {
        error: "An unexpected server error occurred.",
        details:
          overallError instanceof Error
            ? overallError.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}