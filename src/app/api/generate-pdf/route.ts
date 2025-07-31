import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import { exec } from "child_process"
import { promisify } from "util"
import jwt from "jsonwebtoken"
import { Createfiles, saveDataUser } from "@/lib/logic"
import { getClientIP, canGuestCreateCV, markGuestCVCreated } from "@/lib/guest-utils"
import { promptIA } from "@/lib/prompt"
import genAI from "@/lib/ai"

const execAsync = promisify(exec)

interface ExecError extends Error {
  stdout: string;
  stderr: string;
  code?: number;
}

const promptIntro = promptIA.make_cv

export async function POST(req: NextRequest) {
  // Generate a unique ID for this request to manage temporary files
  const { tempDir, texFilePath, pdfFilePath } = Createfiles('PDF')

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
    const prompt = body?.prompt || promptIntro

    // Save CV for authenticated users
    if (isAuthenticated && userId) {
      await saveDataUser(userId, cvData)
    }

    const inputData = body?.data
    
    if (!inputData || typeof inputData !== "string") {
      return NextResponse.json(
        { error: 'Missing or invalid input data. Please provide a string for "data".' },
        { status: 400 },
      )
    }
    
    const model = genAI
    const result = await model.generateContent(`${prompt}\n\n${inputData}`)
    const response =  result.response
    let latex =  response.text()

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
    //await fs.rm(tempDir, { recursive: true, force: true })
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
  } 
  finally {
    // Clean up temporary files if they exist
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
    } catch (cleanupError) {
      console.error("Failed to clean up temporary files:", cleanupError)
    }
  }
}
