import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { promises as fs } from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"
import crypto from "crypto" // Import crypto for unique IDs
import jwt from "jsonwebtoken"
import { saveCV } from "@/lib/logic"
import { getClientIP, canGuestCreateCV, markGuestCVCreated } from "@/lib/guest-utils"

const execAsync = promisify(exec)

// Define an interface for the error object that execAsync might return
interface ExecError extends Error {
  stdout: string;
  stderr: string;
  code?: number;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const promptIntro = `
You are an expert resume writer and LaTeX author. Generate a fully compilable, minimal, and professional CV document in LaTeX that includes:

- A complete LaTeX document structure (\\documentclass, \\usepackage, \\begin{document}, \\end{document}).
- Use only common LaTeX packages compatible with Tectonic (e.g., article, geometry, hyperref, enumitem).
- Clear, readable formatting suitable for recruiters.
- Include standard sections such as Contact Information, Summary, Skills, Work Experience, and Education.
- Use formal and professional language, focusing on relevant skills and quantifiable achievements.
- Employ strong action verbs and concise bullet points.
- Avoid raw ampersands (&) outside of tables; escape them as \\&.
- Output only the LaTeX code, nothing else.

Use the following data to create the CV:
`

export async function POST(req: NextRequest) {
  // Generate a unique ID for this request to manage temporary files
  const requestId = crypto.randomUUID()
  const tempDir = path.resolve(process.cwd(), `temp_cv_${requestId}`)
  const texFileName = "main.tex"
  const pdfFileName = "main.pdf"
  const texFilePath = path.join(tempDir, texFileName)
  const pdfFilePath = path.join(tempDir, pdfFileName)

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables.")
      return NextResponse.json({ error: "Server configuration error: Gemini API key is missing." }, { status: 500 })
    }

    const token = req.cookies.get("auth")?.value
    let userId: number | null = null
    let isAuthenticated = false

    // Check if user is authenticated
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string)
        const { userId: authUserId } = payload as { userId: number }
        userId = authUserId
        isAuthenticated = true
      } catch {
        // Token invalid, treat as guest
      }
    }

    // Handle guest user restrictions
    if (!isAuthenticated) {
      const ip = await getClientIP()
      const { canCreate, reason } = await canGuestCreateCV(ip)

      if (!canCreate) {
        return NextResponse.json(
          {
            error: "Guest usage limit reached",
            message: "You have already created a CV as a guest. Please sign up or log in to continue creating CVs.",
            requiresAuth: true,
            reason,
          },
          { status: 403 },
        )
      }
    }

    // Validate the request body
    const body = await req.json()
    const cvData = JSON.parse(body?.data || "{}")

    // Save CV for authenticated users
    if (isAuthenticated && userId) {
      await saveCV(userId, cvData)
    }

    const inputData = body?.data
    if (!inputData || typeof inputData !== "string") {
      return NextResponse.json(
        { error: 'Missing or invalid input data. Please provide a string for "data".' },
        { status: 400 },
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(`${promptIntro}\n\n${inputData}`)
    const response = await result.response
    let latex = await response.text()

    latex = latex.replace(/```latex|```/gi, "").trim()
    await fs.mkdir(tempDir, { recursive: true })
    await fs.writeFile(texFilePath, latex, "utf8")

    try {
      const { stdout, stderr } = await execAsync(`tectonic --outdir ${tempDir} ${texFilePath}`)
      console.log("Tectonic stdout:", stdout)
      if (stderr) {
        console.error("Tectonic stderr:", stderr)
      }
    } catch (err: unknown) { // Use unknown for the catch variable
      const error = err as ExecError; // Cast to the specific interface
      console.error("Tectonic compilation error:", error.message);
      return NextResponse.json(
        { error: "Failed to compile LaTeX document with Tectonic.", details: error.stderr || error.message },
        { status: 500 },
      );
    }

    if (!isAuthenticated) {
      const ip = await getClientIP()
      await markGuestCVCreated(ip)
    }

    // Read the compiled PDF file
    const pdfBuffer = await fs.readFile(pdfFilePath)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=cv.pdf",
      },
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Internal server error occurred during CV generation.", details: (error as Error).message },
      { status: 500 },
    )
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
      console.log(`Temporary directory cleaned up: ${tempDir}`)
    } catch (cleanupErr) {
      console.error(`Error cleaning up temporary directory ${tempDir}:`, cleanupErr)
    }
  }
}
