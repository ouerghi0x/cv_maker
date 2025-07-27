
// Define types for all data sections
type PersonalInfoData = {
  name: string
  email: string
  phone: string
  address: string
  linkedin: string
  github: string
  website: string
}

type Education = {
  degree: string
  institution: string
  yearStarted: string
  yearOfGraduation: string
}

type Experience = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

type Skill = {
  skill: string
  proficiency: string
}

type Project = {
  projectName: string
  description: string
  technologies: string
  link: string
  startDate: string
  endDate: string
}

type Certification = {
  name: string
  issuingOrganization: string
  issueDate: string
  expirationDate?: string
}

type Language = {
  language: string
  proficiency: string
}

type CVData = {
  cvType: string
  personalInfo: PersonalInfoData
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  jobPost: string
}
export type { 
   
  CVData 
};