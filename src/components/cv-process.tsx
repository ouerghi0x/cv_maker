"use client"

import { useEffect, useState, useCallback, useMemo, JSX, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Loader2, Save } from "lucide-react"
import { InformationCircleIcon } from '@heroicons/react/24/outline'

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
import type { CVData, EmailProps, outputAiEmail } from "@/lib/type"

// Define the GuestInfo interface here or import it from a shared types file
// This type should match the structure returned by your /api/guest/check endpoint
interface GuestInfo {
  ip: string
  location?: string
  hasCreatedCV: boolean
  createdAt?: string
  expiresAt?: string
  // Add any other properties your API returns for guestInfo
  cvCount?: number
  maxCvAllowed?: number
}

// Define a custom error interface to include status and requiresAuth
interface CustomCVGenerationError extends Error {
  status?: number
  requiresAuth?: boolean
}

// Assuming GuestRestrictionModalProps is defined in guest-restriction-modal.tsx
// and imports GuestInfo. If not, you might need to adjust the import path or define it here.
import GuestRestrictionModal from "./guest-restriction-modal"
import DataTest from "@/lib/test"
import { promptIA } from "@/lib/prompt"
import SelectSource from "./ui/select_source"
import EmailTemplate from "./EmailTemp/email-template"

const CV_DATA_STORAGE_KEY = "cv_builder_data"
const CURRENT_STEP_STORAGE_KEY = "cv_builder_current_step"

/**
 * Generates a CV by sending data to the backend API.
 * @param data The CV data to be sent.
 * @returns A Promise that resolves to a Blob (PDF) or null if generation fails.
 * @throws Error if the API response is not OK, including custom properties for specific error handling.
 */
type documentOutput = { blob: Blob; filename: string ,cvId:number,pdfBase64:string} | null
async function generateDocument(data: CVData,api:string,prompt:string,type:string,cvid:number|null): Promise<documentOutput> {
  try {
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: JSON.stringify(DataTest), prompt,type ,cvId:cvid }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to generate PDF" }))
      const errorMessage = errorData.message || "Failed to generate PDF"
      const error: CustomCVGenerationError = new Error(errorMessage)
      error.status = response.status
      error.requiresAuth = response.status === 403
      throw error
    }
    const responseData = await response.clone().json();
   // Extract the Base64 PDF string, filename, and cvId
    const pdfBase64 = responseData.pdfBase64;
    const filename = responseData.filename || "document.pdf"; // Use provided filename or a default
    const cvId = responseData.cvId || null;

    // Convert Base64 string back to a Blob
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

    // For demonstration, you can still use alert, but in a real app,
    // you'd typically display the PDF or trigger a download.
    //alert(`CV ID: ${cvId}, Filename: ${filename}`); // Example alert

    return { blob: pdfBlob, filename: filename, cvId: cvId,pdfBase64: pdfBase64 };
  } catch (error) {
    console.error("Error generating CV:", error)
    throw error
  }
}

/**
 * Saves CV data and current step to localStorage.
 * @param data The CV data to save.
 * @param step The current step number.
 */
const saveToStorage = (data: CVData, step: number) => {
  try {
    localStorage.setItem(CV_DATA_STORAGE_KEY, JSON.stringify(data))
    localStorage.setItem(CURRENT_STEP_STORAGE_KEY, step.toString())
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

/**
 * Loads CV data and current step from localStorage.
 * @returns An object containing the loaded CV data and step, or null/0 if not found or an error occurs.
 */
const loadFromStorage = (): { data: CVData | null; step: number } => {
  try {
    const savedData = localStorage.getItem(CV_DATA_STORAGE_KEY)
    const savedStep = localStorage.getItem(CURRENT_STEP_STORAGE_KEY)

    return {
      data: savedData ? JSON.parse(savedData) : null,
      step: savedStep ? Number.parseInt(savedStep, 10) : 0,
    }
  } catch (error) {
    console.error("Failed to load from localStorage:", error)
    return { data: null, step: 0 }
  }
}

/**
 * Clears all CV builder data from localStorage.
 */
const clearStorage = () => {
  try {
    localStorage.removeItem(CV_DATA_STORAGE_KEY)
    localStorage.removeItem(CURRENT_STEP_STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear localStorage:", error)
  }
}
export interface CreateFilesResult {
  message: string[]
  blobfile: Blob | null | JSX.Element // Allow Blob or JSX.Element for EmailTemplate
  filename: string // Assuming filename is a string
  pdfBase64?: string // Optional Base64 string for PDF content
  index?: number // Optional index for tracking which file this is
}
export default function CvProcess() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<CreateFilesResult[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [showContentDescription, setShowContentDescription] = useState(false)
  const [cvId, setCvId] = useState<number | null>(null) // State to hold CV ID if needed
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [guestRestriction, setGuestRestriction] = useState<{
    isRestricted: boolean
    guestInfo?: GuestInfo // Using the defined GuestInfo interface
    showModal: boolean
  }>({
    isRestricted: false,
    showModal: false,
  })
  const [index, setIndex] = useState(0)
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

  useEffect(() => {
    const { data, step } = loadFromStorage()
    if (data) {
      setCvData(data)
      setCurrentStep(step)
      setLastSaved(new Date())
    }
    setIsDataLoaded(true)
  }, [])

  useEffect(() => {
    if (isDataLoaded) {
      saveToStorage(cvData, currentStep)
      setLastSaved(new Date())
    }
  }, [cvData, currentStep, isDataLoaded])

  useEffect(() => {
    async function checkGuestStatus() {
      try {
        const response = await fetch("/api/guest/check")
        if (response.ok) {
          const data = await response.json()
          if (!data.isAuthenticated && !data.canCreateCV) {
            // Ensure data.guestInfo conforms to GuestInfo type
            const fetchedGuestInfo: GuestInfo = {
              ip: data.guestInfo?.ip || "unknown", // Provide fallback for required fields
              hasCreatedCV: data.guestInfo?.hasCreatedCV || false, // Provide fallback
              location: data.guestInfo?.location,
              createdAt: data.guestInfo?.createdAt,
              expiresAt: data.guestInfo?.expiresAt,
              cvCount: data.guestInfo?.cvCount,
              maxCvAllowed: data.guestInfo?.maxCvAllowed,
            }

            setGuestRestriction({
              isRestricted: true,
              guestInfo: fetchedGuestInfo,
              showModal: false, // Don't show immediately, show when they try to generate
            })
          }
        }
      } catch (error) {
        console.error("Error checking guest status:", error)
      }
    }

    if (isDataLoaded) {
      checkGuestStatus()
    }
  }, [isDataLoaded])

  const steps = useMemo(
    () => [
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
    ],
    [],
  ) // Empty dependency array means this array is created once

  // Memoized update data function to prevent infinite loops
  const updateData = useCallback(<K extends keyof CVData>(section: K, data: CVData[K]) => {
    setCvData((prev) => ({ ...prev, [section]: data }))
    setValidationErrors([])
  }, [])

  // Validation function
  const validateCurrentStep = useCallback((): boolean => {
    const errors: string[] = []
    const step = steps[currentStep]

    // Handle case where step might be undefined (e.g., currentStep out of bounds)
    if (!step) {
      console.error("Invalid current step for validation:", currentStep)
      setValidationErrors(["Invalid step encountered."])
      return false
    }

    if (!step.required) {
      return true // Optional steps are always valid
    }

    switch (step.component) {
      case "type-cv":
        console.log("Validating CV Type:", cvData.cvType) // Debug log
        if (!cvData.cvType || cvData.cvType.trim() === "") {
          errors.push("CV Type is required")
        }
        break
      case "personal-info":
        if (!cvData.personalInfo.name || cvData.personalInfo.name.trim() === "") {
          errors.push("Name is required")
        }
        if (!cvData.personalInfo.email || cvData.personalInfo.email.trim() === "") {
          errors.push("Email is required")
        } else if (!/\S+@\S+\.\S+/.test(cvData.personalInfo.email)) {
          errors.push("Email format is invalid")
        }
        if (!cvData.personalInfo.phone || cvData.personalInfo.phone.trim() === "") {
          errors.push("Phone is required")
        }
        if (!cvData.personalInfo.address || cvData.personalInfo.address.trim() === "") {
          errors.push("Address is required")
        }
        break
      // Add validation for other required steps if any
    }

    setValidationErrors(errors)
    return errors.length === 0
  }, [currentStep, cvData, steps]) // 'steps' is now a stable reference due to useMemo

  // Navigation functions
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, steps.length])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const validateAndProceed = useCallback(() => {
    if (validateCurrentStep()) {
      nextStep()
    }
  }, [validateCurrentStep, nextStep])

  const handleGenerateCV = async () => {
    if (guestRestriction.isRestricted) {
      setGuestRestriction((prev) => ({ ...prev, showModal: true }))
      return
    }

    setIsLoading(true)
    try {
      const doc = await generateDocument(cvData,'/api/generate-pdf',promptIA.make_cv,"cv",null)
      if (!doc || !doc.blob) {
        setValidationErrors(["Failed to generate CV. Please try again."])
        return
      }
      if (doc.blob) {
        setPdfBlob((prev) => [
          ...prev,
          {
            message: ["CV Ready", "Download your CV"],
            blobfile: doc.blob,
            pdfBase64: doc.pdfBase64, // Add the Base64 string to the blobfile
            filename: doc.filename, // Assuming the filename is returned in the response headers
            index: 0, 
          },
        ]);
        setCvId(doc.cvId); // Set the CV ID if available
        setIndex(pdfBlob.length); // Set index to the newly added blob
        setValidationErrors([]);
        // Do NOT clear storage here, only on "Create Another CV"
      } else {
        setValidationErrors(["Failed to generate CV. Please try again."]);
      }
    } catch (error: unknown) {
      // Use unknown for safer type checking
      console.error("Error generating CV:", error)
      if (error instanceof Error) {
        // Safely check for custom properties on the error object by casting to CustomCVGenerationError
        const customError = error as CustomCVGenerationError
        if (customError.status === 403 && customError.requiresAuth) {
          setGuestRestriction((prev) => ({
            ...prev,
            isRestricted: true,
            showModal: true,
          }))
          setValidationErrors(["You need to be logged in or have sufficient guest credits to generate a CV."])
        } else {
          setValidationErrors([error.message])
        }
      } else {
        setValidationErrors(["An unexpected error occurred during CV generation."])
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Download PDF function
  const downloadPDF = (i:number,type_file_download:string) => {
    if (pdfBlob.length === 0 || !pdfBlob[i] || !pdfBlob[i].blobfile) {
      setValidationErrors(["No PDF available to download. Please generate a CV first."])
      return
    }
    console.log(pdfBlob.length)
    if (pdfBlob[i].blobfile) {
      const url = URL.createObjectURL(pdfBlob[i].blobfile as Blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${cvData.personalInfo.name || "CV"}.${type_file_download}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }
  const resetForm = useCallback(() => {
    clearStorage()
    setCvData({
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
    setCurrentStep(0)
    setPdfBlob([]) // Clear all generated PDFs
    setValidationErrors([])
  }, []) // Empty dependency array as it doesn't depend on any state

  // Memoized onChange handlers for each step (already good)
  const handleCvTypeChange = useCallback(
    (type: string) => {
      updateData("cvType", type)
    },
    [updateData],
  )

  const handlePersonalInfoChange = useCallback(
    (info: CVData["personalInfo"]) => {
      updateData("personalInfo", info)
    },
    [updateData],
  )

  const handleEducationChange = useCallback(
    (education: CVData["education"]) => {
      updateData("education", education)
    },
    [updateData],
  )

  const handleExperienceChange = useCallback(
    (experience: CVData["experience"]) => {
      updateData("experience", experience)
    },
    [updateData],
  )

  const handleSkillsChange = useCallback(
    (skills: CVData["skills"]) => {
      updateData("skills", skills)
    },
    [updateData],
  )

  const handleProjectsChange = useCallback(
    (projects: CVData["projects"]) => {
      updateData("projects", projects)
    },
    [updateData],
  )

  const handleCertificationsChange = useCallback(
    (certifications: CVData["certifications"]) => {
      updateData("certifications", certifications)
    },
    [updateData],
  )

  const handleLanguagesChange = useCallback(
    (languages: CVData["languages"]) => {
      updateData("languages", languages)
    },
    [updateData],
  )

  const handleJobPostChange = useCallback(
    (jobPost: string) => {
      updateData("jobPost", jobPost)
    },
    [updateData],
  )

  // Form steps array - Memoize this as well because its elements depend on memoized callbacks and state
  const formSteps = useMemo(
    () => [
      <TypeCV key="type-cv" next={validateAndProceed} onChange={handleCvTypeChange} initialData={cvData.cvType} />,
      <PersonalInfo
        key="personal-info"
        next={validateAndProceed}
        prev={prevStep}
        onChange={handlePersonalInfoChange}
        initialData={cvData.personalInfo}
      />,
      <PersonalEducation
        key="education"
        next={nextStep}
        prev={prevStep}
        onChange={handleEducationChange}
        initialData={cvData.education}
      />,
      <PersonalExperience
        key="experience"
        next={nextStep}
        prev={prevStep}
        onChange={handleExperienceChange}
        initialData={cvData.experience}
      />,
      <PersonalSkills
        key="skills"
        next={nextStep}
        prev={prevStep}
        onChange={handleSkillsChange}
        initialData={cvData.skills}
      />,
      <PersonalProjects
        key="projects"
        next={nextStep}
        prev={prevStep}
        onChange={handleProjectsChange}
        initialData={cvData.projects}
      />,
      <PersonalCertification
        key="certifications"
        next={nextStep}
        prev={prevStep}
        onChange={handleCertificationsChange}
        initialData={cvData.certifications}
      />,
      <PersonalLanguages
        key="languages"
        next={nextStep}
        prev={prevStep}
        onChange={handleLanguagesChange}
        initialData={cvData.languages}
      />,
      <PostJobToPostuleFor
        key="job-post"
        next={nextStep}
        prev={prevStep}
        onChange={handleJobPostChange}
        initialData={cvData.jobPost}
      />,
    ],
    [
      validateAndProceed,
      nextStep,
      prevStep,
      handleCvTypeChange,
      handlePersonalInfoChange,
      handleEducationChange,
      handleExperienceChange,
      handleSkillsChange,
      handleProjectsChange,
      handleCertificationsChange,
      handleLanguagesChange,
      handleJobPostChange,
      cvData, // cvData is a dependency because initialData is passed to child components
    ],
  )

  // Don't render until data is loaded
  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your CV data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Progress Bar (Always visible at the top) */}
        {pdfBlob.length  == 0 && (
          <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">CV Builder Progress</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {lastSaved && (
                  <>
                    <Save className="w-3 h-3" />
                    <span className="hidden sm:inline">Last saved: {lastSaved.toLocaleTimeString()}</span>
                    <span className="sm:hidden">Saved</span>
                  </>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>
                Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
              </span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
          </div>
        </div>
        )}
        

        {pdfBlob.length === 0 ? (
          // Layout for Data Filling (Vertical Progress Bar + Form)
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[calc(100vh-190px)]"> {/* Adjusted min-h for vertical layout */}
            {/* Left Vertical Progress Bar */}
            <div className="w-full lg:w-64 lg:flex-shrink-0"> {/* Adjusted width for vertical bar */}
              <Card className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-64px)] lg:overflow-y-auto">
                <CardHeader>
                  <CardTitle className="text-lg">Steps</CardTitle>
                    <p className="text-sm text-gray-600">Complete the steps to create your CV</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center w-54 space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                        index === currentStep
                          ? "bg-blue-50 border-2 border-blue-200"
                          : index < currentStep
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        if (index <= currentStep) {
                          setCurrentStep(index)
                        }
                      }}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : index === currentStep ? (
                        <Circle className="w-5 h-5 text-blue-600 fill-current flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            index === currentStep
                              ? "text-blue-900"
                              : index < currentStep
                                ? "text-green-900"
                                : "text-gray-600"
                          }`}
                        >
                          {step.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {step.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                          {index < currentStep && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                              Complete
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area for Form Steps */}
            <div className="flex-1">
              <Card>
                <CardContent className="p-4 sm:p-6 lg:p-8">
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
                  {currentStep < formSteps.length ? (
                    formSteps[currentStep]
                  ) : currentStep === steps.length - 1 ? (
                    // Generate CV Step when no PDF is generated yet
                    <div className="text-center space-y-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ready to Generate Your CV</h2>
                        <p className="text-gray-600">
                          Review your information and generate your CV, or create a cover letter, email template.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg text-left max-w-2xl mx-auto">
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
                      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <Button variant="outline" onClick={prevStep} className="w-full sm:w-auto bg-transparent">
                          Back to Edit
                        </Button>
                        <Button
                          onClick={handleGenerateCV}
                          disabled={isLoading}
                          className="min-w-[140px] w-full sm:w-auto"
                        >
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
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Layout for Generated  (PDF Preview + Right Sidebar)
          <div className= "  flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main Content Area for PDF Preview */}
            <div className="flex-1">
                
              <Card>
                <CardContent className="p-4 sm:p-6 lg:p-8">
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

                {/* Floating Navigation and Info Buttons */}
                <div className="z-50 fixed left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
                  <button
                    className="p-2 rounded-full bg-blue-200 shadow-md hover:bg-blue-300 transition-all"
                    onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
                  >
                    <div className="text-blue-600 text-xl">{'<'}</div>
                  </button>
                  <button
                    className="p-2 rounded-full bg-green-200 shadow-md hover:bg-green-300 transition-all"
                    onClick={() => setIndex((prev) => Math.min(prev + 1, pdfBlob.length - 1))}
                  >
                    <div className="text-green-600 text-xl">{'>'}</div>
                  </button>
                  {/* Optional Info Icon, if needed */}
                  {!showContentDescription && (
                    <button
                      className="p-2 mt-4 rounded-full bg-gray-200 shadow-md hover:bg-gray-300 transition-all"
                      onClick={() => setShowContentDescription(!showContentDescription)}
                    >
                      <InformationCircleIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>

                {/* PDF Content Area */}
                <div className="space-y-6">
                  {/* Conditional Description Content or Info Icon */}
                  {showContentDescription ? (
                    DescriptionContent(pdfBlob, index, setShowContentDescription)
                  ) : (
                    <div className="flex items-center justify-center">
                      <div 
                        onClick={() => setShowContentDescription(!showContentDescription)}
                        className="flex z-50 items-center space-x-2 text-gray-600 cursor-pointer"
                      >
                        
                      </div>
                    </div>
                  )}
                  
                  <div className="relative bottom-7 space-y-4">
                    <div className="bg-gray-50 p-3   sm:p-4 rounded-lg ">
                      {pdfBlob.length > 0 && pdfBlob[index].blobfile && pdfBlob[index].index !== undefined &&  pdfBlob[index].index<2 ? (
                        <iframe
                          src={pdfBlob[index].blobfile instanceof Blob ? URL.createObjectURL(pdfBlob[index].blobfile) : ""}
                          className="w-full h-[calc(100vh-250px)] md:h-[calc(100vh-200px)] border border-gray-300 rounded-md shadow-inner"
                          title="Generated Document Preview"
                          onLoad={() => {
                            if (pdfBlob[index].blobfile instanceof Blob) {
                            URL.revokeObjectURL(URL.createObjectURL(pdfBlob[index].blobfile));
                            //seturls((prev) => [...prev, URL.createObjectURL(pdfBlob[index].blobfile as Blob)]);  
                          }
                          }}
                        />
                      ) : pdfBlob[index]?.blobfile ? (
                        <div >
                        {pdfBlob[index].blobfile as JSX.Element}
                        </div>
                        
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Document Actions and Generation Controls */}
            <div className="w-full lg:w-80 lg:flex-shrink-0">
              <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-64px)] lg:overflow-y-auto space-y-6">
                {/* Document Actions Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-center">Document Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-full">
                        <label htmlFor="download-select" className="sr-only">Select Source to Download</label>
                        <SelectSource downloadPDF={downloadPDF} />
                      </div>
                      <Button
                        variant="outline"
                        onClick={async () => {
                          const blob = await generateDocument(cvData, '/api/generate-pdf', promptIA.generate_cover_letter, "cover",cvId);
                          if (blob) {
                            let found = false;
                            for (let i = 0; i < pdfBlob.length; i++) {
                              if (!pdfBlob[i].blobfile) {
                                setIndex(i);
                                found = true;
                                break;
                              }
                            }
                            if (!found) {
                              setIndex(pdfBlob.length);
                            }
                            setPdfBlob(
                              [
                                ...pdfBlob,
                                {
                                  message: ["Cover Letter generated successfully", "Your cover letter is ready for download."],
                                  blobfile: blob.blob,
                                  filename:blob.filename || "cover_letter.pdf",
                                  pdfBase64: blob.pdfBase64, // Add the Base64 string to the blobfile
                                  index: 1,
                                },
                              ] as CreateFilesResult[]
                            );
                            setValidationErrors([]);
                          } else {
                            setValidationErrors(["Failed to generate Cover Letter. Please try again."]);
                          }
                        }}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm py-2 px-3"
                      >
                      Get Cover Letter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          fetch('/api/email_job', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ data: JSON.stringify(DataTest), prompt: promptIA.prompt_generate_job_application_email }),
                          })
                            .then(response => response.json())
                            .then((data:outputAiEmail) => {
                              if (data) {
                                let found = false;
                                for (let i = 0; i < pdfBlob.length; i++) {
                                  if (pdfBlob[i].index  ==3) {
                                    setIndex(i);
                                    found = true;
                                    break;
                                  }
                                }
                                if (!found) {
                                  setIndex(pdfBlob.length);
                                  FillEmail(pdfBlob, data, setPdfBlob)
                                }else{
                                  const filterblobs = pdfBlob.filter((item) => item.index !== 3);
                                  FillEmail(filterblobs, data, setPdfBlob)
                                }
                                
                                setValidationErrors([]);
                              } else {
                                setValidationErrors(["Failed to generate Email Template. Please try again."]);
                              }
                            })
                            .catch(error => {
                              console.error("Error generating email template:", error);
                              setValidationErrors(["An error occurred while generating the Email Template."]);
                            });
                          
                        }}
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 text-sm py-2 px-3"
                      >
                        Get Email Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Generation Controls Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-center">Generation Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      className="w-full border-blue-500 text-blue-700 hover:bg-blue-50 text-sm py-2 px-3"
                    >
                      Create Another CV
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGenerateCV}
                      className="w-full border-purple-500 text-purple-700 hover:bg-purple-50 text-sm py-2 px-3"
                    >
                      Generate Again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Guest Restriction Modal */}
      <GuestRestrictionModal
        isOpen={guestRestriction.showModal}
        onClose={() => setGuestRestriction((prev) => ({ ...prev, showModal: false }))}
        guestInfo={guestRestriction.guestInfo}
      />
    </div>
  )
}
function DescriptionContent(pdfBlob: CreateFilesResult[], index: number,setShowContentDescription: React.Dispatch<React.SetStateAction<boolean>>) {
  return (
    // Backdrop for the pop-up
    <div className= " w-sm fixed   top-150 left-280 inset-0 z-[100] flex items-center justify-center  opacity-70">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg mx-4 space-y-6 transform transition-all scale-100 ease-out duration-300">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {pdfBlob.length > 0 && pdfBlob[index]?.message.length > 0 && pdfBlob[index].message[0]
              ? pdfBlob[index].message[0]
              : "Ready to Generate Your CV"}
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            {pdfBlob.length > 0 && pdfBlob[index]?.message.length > 1
              ? pdfBlob[index].message[1] || "Your CV is ready for download."
              : "Review your information and generate your CV, or create a cover letter or email template."}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowContentDescription(false)}
            className="px-6 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Hide Description
          </button>
        </div>
      </div>
    </div>
  );
}


function FillEmail(pdfBlob: CreateFilesResult[], data: outputAiEmail, setPdfBlob: { (value: SetStateAction<CreateFilesResult[]>): void; (arg0: CreateFilesResult[]): void }) {
  let cvfile = undefined
  let coverfile = undefined
  const  urls: string[] = [
    pdfBlob[0]?.filename || "cv.pdf",
    pdfBlob[1]?.filename || "cover_letter.pdf",
  ]
  const base64urls = [
    pdfBlob[0]?.pdfBase64 || "",
    pdfBlob[1]?.pdfBase64 || "",
  ]
  for (let i = 0; i < pdfBlob.length; i++) {
    if (pdfBlob[i].index === 0) {
      cvfile = pdfBlob[i].blobfile

    }
    if (pdfBlob[i].index === 1) {
      coverfile = pdfBlob[i].blobfile
    }
  }
  //const urls=[URL.createObjectURL(cvfile as Blob), URL.createObjectURL(coverfile as Blob)]
  const email_template: EmailProps = {
    emailBody: data.emailBody,
    emailSubject: data.emailSubject,
    destinationEmail: data.destinationEmail,
    senderEmail: data.senderEmail,
    cvFile: cvfile as Blob,
    coverLetter: coverfile as Blob
  }


  setPdfBlob([
    ...pdfBlob,
    {
      message: ["Email Ready", "Template prepared."],
      blobfile: <EmailTemplate initialData={email_template} pdfBlobs={base64urls}/>,
      index: 3,
    },
  ] as CreateFilesResult[])
}

