import path from "path";
import prisma from "./prisma";
import { CVData } from "./type";
async function saveDataUser(userId: number, cvData: CVData, pdftype: "cv" | "cover" = "cv",pdfpath:string = "",cvId: number | null = null) {
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
    };
    // Check if cvId exists in cvData
    let cv = null;
    if (cvId) {
      const updateData: Partial<typeof commonData & { pdfcvUrl?: string; pdfcoverUrl?: string }> = { ...commonData };

      

      cv = await prisma.cV.update({
        where: { id: cvId },
        data: updateData,
      });
      console.log(`CV with ID ${cvId} updated successfully.`);
    } else {
      const createData = {
        ...commonData,
        pdfcvUrl: pdftype === "cv" ? pdfpath : null,
        pdfcoverUrl: pdftype === "cover" ? pdfpath : null,
      };

      cv = await prisma.cV.create({
        data: createData,
      });
      console.log("New CV created successfully.");
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


export { saveDataUser,Createfiles };
