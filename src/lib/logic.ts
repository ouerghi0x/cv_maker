import path from "path";
import prisma from "./prisma";
import { CVData } from "./type";

async function saveDataUser(userId: number, cvData: CVData) {
  //console.log(cvData)
  try {
    const cv = await prisma.cV.create({
      data: {
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
      },
    });

    return cv;
  } catch (error) {
    console.error("Error saving CV:", error);
    throw new Error("Failed to save CV.");
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


export { saveDataUser,Createfiles };
