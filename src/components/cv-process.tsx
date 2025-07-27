"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Loader2 } from "lucide-react"

// Import all step components
import TypeCV from "./steps/type-cv"
import PersonalInfo from "./steps/personal-info"
import PersonalEducation from "./steps/personal-education"
import PersonalExperience from "./steps/personal-experience"
import PersonalSkills from "./steps/personal-skills"
import PersonalProjects from "./steps/personal-projects"
import PersonalCertification from "./steps/personal-certification"
import PersonalLanguages from "./steps/personal-languages"
import PostJobToPostuleFor from "./steps/post-job"

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

async function generateCV(data: CVData): Promise<Blob | null> {
  try {
    const response = await fetch("/api/generate-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: JSON.stringify(data) }), // Double stringify to match API expectation
    })

    if (!response.ok) {
      throw new Error("Failed to generate PDF")
    }

    return await response.blob()
  } catch (error) {
    console.error("Error generating CV:", error)
    return null
  }
}

export default function CvProcess() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [cvData, setCvData] = useState<CVData>({
    cvType: "",
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      github: "",
      website: "",
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    jobPost: "",
  })

  // Step configuration
  const steps = [
    { title: "CV Type", component: "type-cv", required: true },
    { title: "Personal Info", component: "personal-info", required: true },
    { title: "Education", component: "education", required: false },
    { title: "Experience", component: "experience", required: false },
    { title: "Skills", component: "skills", required: false },
    { title: "Projects", component: "projects", required: false },
    { title: "Certifications", component: "certifications", required: false },
    { title: "Languages", component: "languages", required: false },
    { title: "Job Post", component: "job-post", required: false },
    { title: "Generate CV", component: "generate", required: false },
  ]

  // Update data function
  const updateData = <K extends keyof CVData>(section: K, data: CVData[K]) => {
    setCvData((prev) => ({ ...prev, [section]: data }))
    setValidationErrors([])
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Validation function
  const validateCurrentStep = (): boolean => {
    const errors: string[] = []
    const step = steps[currentStep]

    if (step.required) {
      switch (step.component) {
        case "type-cv":
          if (!cvData.cvType.trim()) errors.push("CV Type is required")
          break
        case "personal-info":
          if (!cvData.personalInfo.name.trim()) errors.push("Name is required")
          if (!cvData.personalInfo.email.trim()) errors.push("Email is required")
          if (!cvData.personalInfo.phone.trim()) errors.push("Phone is required")
          break
      }
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  // Handle CV generation
  const handleGenerateCV = async () => {
    setIsLoading(true)
    try {
      const blob = await generateCV(cvData)
      if (blob) {
        setPdfBlob(blob)
        // Don't call nextStep() here - let the user see the generation step first
      } else {
        setValidationErrors(["Failed to generate CV. Please try again."])
      }
    } catch (error) {
      setValidationErrors(["An error occurred while generating your CV."])
    } finally {
      setIsLoading(false)
    }
  }

  // Download PDF function
  const downloadPDF = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${cvData.personalInfo.name || "CV"}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // Form steps array
  const formSteps = [
    <TypeCV
      key="type-cv"
      next={nextStep}
      onChange={(type) => updateData("cvType", type)}
      initialData={cvData.cvType}
    />,
    <PersonalInfo
      key="personal-info"
      next={nextStep}
      prev={prevStep}
      onChange={(info) => updateData("personalInfo", info)}
      initialData={cvData.personalInfo}
    />,
    <PersonalEducation
      key="education"
      next={nextStep}
      prev={prevStep}
      onChange={(education) => updateData("education", education)}
      initialData={cvData.education}
    />,
    <PersonalExperience
      key="experience"
      next={nextStep}
      prev={prevStep}
      onChange={(experience) => updateData("experience", experience)}
      initialData={cvData.experience}
    />,
    <PersonalSkills
      key="skills"
      next={nextStep}
      prev={prevStep}
      onChange={(skills) => updateData("skills", skills)}
      initialData={cvData.skills}
    />,
    <PersonalProjects
      key="projects"
      next={nextStep}
      prev={prevStep}
      onChange={(projects) => updateData("projects", projects)}
      initialData={cvData.projects}
    />,
    <PersonalCertification
      key="certifications"
      next={nextStep}
      prev={prevStep}
      onChange={(certifications) => updateData("certifications", certifications)}
      initialData={cvData.certifications}
    />,
    <PersonalLanguages
      key="languages"
      next={nextStep}
      prev={prevStep}
      onChange={(languages) => updateData("languages", languages)}
      initialData={cvData.languages}
    />,
    <PostJobToPostuleFor
      key="job-post"
      next={nextStep}
      prev={prevStep}
      onChange={(jobPost) => updateData("jobPost", jobPost)}
      initialData={cvData.jobPost}
    />,
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Step Indicator */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">CV Builder Progress</CardTitle>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                      index === currentStep
                        ? "bg-blue-50 border border-blue-200"
                        : index < currentStep
                          ? "bg-green-50"
                          : "bg-gray-50"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : index === currentStep ? (
                      <Circle className="w-5 h-5 text-blue-600 fill-current" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          index === currentStep
                            ? "text-blue-900"
                            : index < currentStep
                              ? "text-green-900"
                              : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </p>
                      {step.required && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-8">
                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-red-800 font-medium mb-2">Please fix the following errors:</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Current Step Content */}
                {currentStep < formSteps.length ? (
                  formSteps[currentStep]
                ) : currentStep === steps.length - 1 ? (
                  // Generate CV Step
                  <div className="text-center space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {pdfBlob ? "CV Generated Successfully!" : "Ready to Generate Your CV"}
                      </h2>
                      <p className="text-gray-600">
                        {pdfBlob
                          ? "Your professional CV is ready for download"
                          : "Review your information and generate your professional CV"}
                      </p>
                    </div>

                    {!pdfBlob && (
                      <>
                        <div className="bg-gray-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
                          <h3 className="font-semibold text-gray-900 mb-4">CV Summary:</h3>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>
                              <strong>Type:</strong> {cvData.cvType || "Not specified"}
                            </p>
                            <p>
                              <strong>Name:</strong> {cvData.personalInfo.name || "Not specified"}
                            </p>
                            <p>
                              <strong>Email:</strong> {cvData.personalInfo.email || "Not specified"}
                            </p>
                            <p>
                              <strong>Education entries:</strong> {cvData.education.length}
                            </p>
                            <p>
                              <strong>Experience entries:</strong> {cvData.experience.length}
                            </p>
                            <p>
                              <strong>Skills:</strong> {cvData.skills.length}
                            </p>
                            <p>
                              <strong>Projects:</strong> {cvData.projects.length}
                            </p>
                            <p>
                              <strong>Certifications:</strong> {cvData.certifications.length}
                            </p>
                            <p>
                              <strong>Languages:</strong> {cvData.languages.length}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-center space-x-4">
                          <Button variant="outline" onClick={prevStep}>
                            Back to Edit
                          </Button>
                          <Button onClick={handleGenerateCV} disabled={isLoading} className="min-w-[140px]">
                            {isLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              "Generate CV"
                            )}
                          </Button>
                        </div>
                      </>
                    )}

                    {pdfBlob && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <iframe
                            src={URL.createObjectURL(pdfBlob)}
                            className="w-full h-96 border rounded"
                            title="Generated CV Preview"
                          />
                        </div>

                        <div className="flex justify-center space-x-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setPdfBlob(null)
                              setCurrentStep(0)
                            }}
                          >
                            Create Another CV
                          </Button>
                          <Button onClick={downloadPDF}>Download PDF</Button>
                          <Button variant="outline" onClick={() => setPdfBlob(null)}>
                            Generate Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
