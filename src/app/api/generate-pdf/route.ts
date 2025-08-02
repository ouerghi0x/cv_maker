import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import { exec } from "child_process"
import { promisify } from "util"
import jwt from "jsonwebtoken"
import { Createfiles, saveDataUser } from "@/lib/logic"
import { getClientIP, canGuestCreateCV, markGuestCVCreated } from "@/lib/guest-utils"
import { promptIA } from "@/lib/prompt"
import generateResponse from "@/lib/ai"

const execAsync = promisify(exec)

interface ExecError extends Error {
  stdout: string;
  stderr: string;
  code?: number;
}

const promptIntro = promptIA.make_cv

export async function POST(req: NextRequest) {
  
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
    const type = body?.type || ""
    const filename = body?.filename || "cv"
    const cvId = body?.cvId ? parseInt(body.cvId, 10) : null
    const { tempDir, texFilePath, pdfFilePath } = Createfiles(filename)
    //tempDiror = tempDir // Store tempDir for cleanup later
    const prompt = body?.prompt || promptIntro
    let cv = null ;
    // Save CV for authenticated users
    if (isAuthenticated && userId && type.trim() != "") {
      cv= await saveDataUser(userId, cvData,type,pdfFilePath,cvId)
    }

    const inputData = body?.data
    
    if (!inputData || typeof inputData !== "string") {
      return NextResponse.json(
        { error: 'Missing or invalid input data. Please provide a string for "data".' },
        { status: 400 },
      )
    }
    
    
    
    
    // Generate and compile the LaTeX document
    await GenerateAndCompileLaTeXDocument(
      texFilePath,
      tempDir,
      prompt,
      inputData
    );

    if (!isAuthenticated) {
      const ip = await getClientIP()
      await markGuestCVCreated(ip)
    }

    // Read the compiled PDF file
    const pdfBuffer = await fs.readFile(pdfFilePath);
    // Convert the PDF buffer to a Base64 string
    const base64Pdf = pdfBuffer.toString('base64');
    return NextResponse.json(
      {
        cvId: cv?.id || null, // Include CV ID
        pdfBase64: base64Pdf, // Include Base64 encoded PDF
        filename: `${pdfFilePath}`, // Include filename for client-side use
        message: `${type}  generated successfully.`,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json", // Ensure Content-Type is JSON
        },
      }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Internal server error occurred during CV generation.", details: (error as Error).message },
      { status: 500 },
    )
  } 
  finally {
    // Clean up temporary files if they exist
    try {
      //await fs.rm(tempDiror, { recursive: true, force: true })
    } catch (cleanupError) {
      console.error("Failed to clean up temporary files:", cleanupError)
    }
  }
}
const GenerateAndCompileLaTeXDocument = async (
  texFilePath: string,
  tempDir: string,
  prompt: string,
  inputData: string,
  latex: string = '',
  retryCount: number = 0 // Add a retryCount parameter
): Promise<string> => { // Specify return type as Promise<string> for the final latex
  const MAX_RETRIES = 3; // Define a maximum number of retries

  try {
    // If latex is not provided, generate it using the AI
    if (latex.length === 0) {
      latex = await generateResponse(prompt, inputData);
    }

    // Clean up the latex string
    latex = latex.replace(/```latex|```/gi, "").trim();

    // Ensure the temporary directory exists
    await fs.mkdir(tempDir, { recursive: true });

    // Write the LaTeX content to the .tex file
    await fs.writeFile(texFilePath, latex, "utf8");

    // Attempt to compile the LaTeX document using Tectonic
    const { stdout, stderr } = await execAsync(`tectonic --outdir ${tempDir} ${texFilePath}`);
    console.log("Tectonic stdout:", stdout);
    if (stderr) {
      console.error("Tectonic stderr:", stderr);
    }

    // If compilation is successful, return the generated LaTeX
    return latex;

  } catch (err: unknown) {
    const error = err as ExecError;
    console.error("Tectonic compilation error:", error.message);

    // Check if we have exceeded the maximum retry limit
    if (retryCount < MAX_RETRIES) {
      console.warn(`Retrying LaTeX compilation (Attempt ${retryCount + 1}/${MAX_RETRIES})...`);

      // Append the error and previous latex to the prompt for the AI to learn from
      const newPrompt = `${prompt}\n\nError during LaTeX compilation (Attempt ${retryCount + 1}): ${error.message}. Previous LaTeX that caused the error: \n\`\`\`latex\n${latex}\n\`\`\`\n\nPlease generate a corrected LaTeX document.`;

      // Recursively call the function with an incremented retry count and new AI response
      return await GenerateAndCompileLaTeXDocument(
        texFilePath,
        tempDir,
        newPrompt,
        inputData,
        await generateResponse(newPrompt, inputData), // Generate new LaTeX for the retry
        retryCount + 1
      );
    } else {
      // If retries are exhausted, throw the error to the calling function
      console.error(`Max retries (${MAX_RETRIES}) reached for LaTeX compilation. Aborting.`);
      throw new Error(`Failed to compile LaTeX document after ${MAX_RETRIES} attempts: ${error.message}`);
    }
  }
};