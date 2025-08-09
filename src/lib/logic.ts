import path from "path";
import prisma from "./prisma";
import { CVData } from "./type";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken"

async function saveDataUser(userId: number, cvData: CVData, pdftype: "cv" | "cover" = "cv",pdfpath:string = "",cvId: number | null = null,latex:string) {
  try {

    const commonData = {
      userId,
      cvType: cvData.cvType || "",
      jobPost: cvData.jobPost || "",
      personalInfo: cvData.personalInfo,
      education: cvData.education,
      experience: cvData.experience,
      skills: cvData.skills,
      projects: cvData.projects,
      certifications: cvData.certifications,
      languages: cvData.languages,
      Cvlatex: pdftype === "cv" ? latex : null,
      CoverLatex: pdftype === "cover" ? latex : null,

    };
    // Check if cvId exists in cvData
    let cv = null;
    if (cvId) {
      const updateData: Partial<typeof commonData & { pdfcvUrl?: string; pdfcoverUrl?: string ; }> = { ...commonData };

      

      cv = await prisma.cV.update({
        where: { id: cvId },
        data: updateData,
      });
      
    } else {
      const createData = {
        ...commonData,
        pdfcvUrl: pdftype === "cv" ? pdfpath : null,
        pdfcoverUrl: pdftype === "cover" ? pdfpath : null,
        
      };

      cv = await prisma.cV.create({
        data: createData,
      });
      
    }

    return cv;
  } catch (error) {
    console.error("Error saving/updating CV:", error);
    throw new Error("Failed to save or update CV.");
  }
}
function Createfiles(filename: string = "main") {
  const requestId = crypto.randomUUID()
  const tempDir = path.resolve(process.cwd(), `temp_cv_${requestId}`)
  const texFileName = `${filename}.tex`
  const pdfFileName = `${filename}.pdf`
  const texFilePath = path.join(tempDir, texFileName)
  const pdfFilePath = path.join(tempDir, pdfFileName)
  return { tempDir, texFilePath, pdfFilePath }
}

export function GetUser(req: NextRequest) {
  const token = req.cookies.get('auth')?.value
  console.log(token)
  let userId: number | null = null
  let isAuthenticated = false
  // Check if user is authenticated
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string)
      const { userId: authUserId } = payload as { userId: number} 
      userId = authUserId
      isAuthenticated = true
    } catch {
      // Token invalid, treat as guest
    }
  }
  return { isAuthenticated, userId }
}

export { saveDataUser,Createfiles };
