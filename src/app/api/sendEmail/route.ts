import SendEmail from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const req_body = await req.json();
    const data = req_body.data;
    const pdfBlobs: string[] = req_body.pdfBlobs || []; // base64 strings

    //console.log("Received data:", pdfBlobs.length);

    const attachments = [];

    if (data.cvFile && pdfBlobs[0]) {
      attachments.push({
        filename: "cv.pdf",
        content: Buffer.from(pdfBlobs[0], "base64"),
        contentType: "application/pdf",
      });
    }

    if (data.coverLetter && pdfBlobs[1]) {
      attachments.push({
        filename: "cover_letter.pdf",
        content: Buffer.from(pdfBlobs[1], "base64"),
        contentType: "application/pdf",
      });
    }
    console.log(data.senderEmail)
    await SendEmail(
      data.senderEmail,
      data.destinationEmail,
      data.emailSubject,
      data.emailBody,
      attachments
    );

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/sendEmail:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
