import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto'; // Import crypto for unique IDs

const execAsync = promisify(exec);

// Initialize Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Define the prompt for the AI model to generate a professional CV in LaTeX
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
`;

export async function POST(req: NextRequest) {
  // Generate a unique ID for this request to manage temporary files
  const requestId = crypto.randomUUID();
  const tempDir = path.resolve(process.cwd(), `temp_cv_${requestId}`);
  const texFileName = 'main.tex';
  const pdfFileName = 'main.pdf';
  const texFilePath = path.join(tempDir, texFileName);
  const pdfFilePath = path.join(tempDir, pdfFileName);

  try {
    // Validate the presence of the Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables.');
      return NextResponse.json(
        { error: 'Server configuration error: Gemini API key is missing.' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const inputData = body?.data;

    // Validate the input data from the request
    if (!inputData || typeof inputData !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid input data. Please provide a string for "data".' }, { status: 400 });
    }

    // Generate LaTeX content using the Gemini AI model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(`${promptIntro}\n\n${inputData}`);
    const response = await result.response;
    let latex = await response.text();

    // Clean up the AI response: remove code block markers
    // The previous line to remove "LaTeX" was removed as it could inadvertently remove legitimate text.
    latex = latex.replace(/```latex|```/gi, '').trim();

    // Create a unique temporary directory for this compilation process
    await fs.mkdir(tempDir, { recursive: true });

    // Write the generated LaTeX content to a .tex file
    await fs.writeFile(texFilePath, latex, 'utf8');
    console.log(`LaTeX file written to: ${texFilePath}`);

    // Compile the .tex file to PDF using Tectonic
    // Ensure Tectonic is installed and accessible in the server's PATH
    try {
      console.log(`Attempting to compile LaTeX with Tectonic: tectonic --outdir ${tempDir} ${texFilePath}`);
      const { stdout, stderr } = await execAsync(`tectonic --outdir ${tempDir} ${texFilePath}`);
      console.log('Tectonic stdout:', stdout);
      if (stderr) {
        console.error('Tectonic stderr:', stderr);
      }
    } catch (err: any) {
      console.error('Tectonic compilation error:', err.message);
      // Include stderr in the response for better debugging
      return NextResponse.json(
        { error: 'Failed to compile LaTeX document with Tectonic.', details: err.stderr || err.message },
        { status: 500 }
      );
    }

    // Read the compiled PDF file
    const pdfBuffer = await fs.readFile(pdfFilePath);
    console.log(`PDF file read from: ${pdfFilePath}`);

    // Return the PDF file as a response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=cv.pdf',
      },
    });

  } catch (error: unknown) {
    // Handle any unexpected errors during the process
    console.error('Error generating LaTeX CV or compiling PDF:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred during CV generation.', details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    // Clean up the temporary directory and its contents
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
      console.log(`Temporary directory cleaned up: ${tempDir}`);
    } catch (cleanupErr) {
      console.error(`Error cleaning up temporary directory ${tempDir}:`, cleanupErr);
    }
  }
}
