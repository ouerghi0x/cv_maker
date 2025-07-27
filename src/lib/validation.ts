import { z } from "zod";

// Define schemas for each sub-object
const PersonalInfoSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  linkedin: z.string().url(),
  github: z.string().url(),
  website: z.string().url(),
});

const EducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  yearStarted: z.string(),
  yearOfGraduation: z.string(),
});

const ExperienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

const SkillSchema = z.object({
  skill: z.string(),
  proficiency: z.string(),
});

const ProjectSchema = z.object({
  projectName: z.string(),
  description: z.string(),
  technologies: z.string(),
  link: z.string().url(),
  startDate: z.string(),
  endDate: z.string(),
});

const CertificationSchema = z.object({
  name: z.string(),
  issuingOrganization: z.string(),
  issueDate: z.string(),
  expirationDate: z.string().optional(),
});

const LanguageSchema = z.object({
  language: z.string(),
  proficiency: z.string(),
});

// Combine into main CV schema
export const CVDataSchema = z.object({
  cvType: z.string(),
  jobPost: z.string(),
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema),
  experience: z.array(ExperienceSchema),
  skills: z.array(SkillSchema),
  projects: z.array(ProjectSchema),
  certifications: z.array(CertificationSchema),
  languages: z.array(LanguageSchema),
});
