import nodemailer from "nodemailer";

// Allow both path-based and buffer-based attachments
export type EmailAttachment = {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType?: string;
};

export type EmailParams = {
  from: string;
  to: string;
  subject: string;
  text: string;
  attachments?: EmailAttachment[];
};

export default async function SendEmail(
  from: string = "",
  to: string = "",
  subject: string = "",
  text: string = "",
  attachments: EmailAttachment[] = []
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "",
      pass: process.env.GMAIL_PASS || "",
    },
    secure: true,
    port: 465,
  });

  try {
    const result = await transporter.sendMail({
      from:process.env.GMAIL_USER || "",
      replyTo:  from,
      to,
      subject: subject || "No Subject",
      text: text || "No content",
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    //console.log("Email sent successfully:", result.messageId);
    return  result; // Return the result for further processing if needed
  } catch (error) {
    console.error("Failed to send email:", (error as Error).message);
    throw error; // re-throw if you want to handle it elsewhere
  }
}
