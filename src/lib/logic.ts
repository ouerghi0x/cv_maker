import prisma from "./prisma";
import { CVData } from "./type";

async function saveCV(userId: number, cvData: CVData) {
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
export { saveCV };
