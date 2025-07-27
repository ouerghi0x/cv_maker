"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Loader2, Save } from "lucide-react"

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
import type { CVData } from "@/lib/type"

// Define the GuestInfo interface here or import it from a shared types file
// This type should match the structure returned by your /api/guest/check endpoint
interface GuestInfo {
  ip: string;
  location?: string;
  hasCreatedCV: boolean;
  createdAt?: string;
  expiresAt?: string;
  // Add any other properties your API returns for guestInfo
  cvCount?: number;
  maxCvAllowed?: number;
}

// Assuming GuestRestrictionModalProps is defined in guest-restriction-modal.tsx
// and imports GuestInfo. If not, you might need to adjust the import path or define it here.
import GuestRestrictionModal from "./guest-restriction-modal"

const CV_DATA_STORAGE_KEY = "cv_builder_data"
const CURRENT_STEP_STORAGE_KEY = "cv_builder_current_step"

/**
 * Generates a CV by sending data to the backend API.
 * @param data The CV data to be sent.
 * @returns A Promise that resolves to a Blob (PDF) or null if generation fails.
 * @throws Error if the API response is not OK, including custom properties for specific error handling.
 */
async function generateCV(data: CVData): Promise<Blob | null> {
  console.log("Generating CV with data:", data)
  try {
    const response = await fetch("/api/generate-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: JSON.stringify(data) }),
    })

    if (!response.ok) {
      // Attempt to parse error message from response
      const errorData = await response.json().catch(() => ({ message: "Failed to generate PDF" }));
      const errorMessage = errorData.message || "Failed to generate PDF";

      const error = new Error(errorMessage);
      // Attach status for specific handling in component
      (error as any).status = response.status; // Type assertion for custom properties
      (error as any).requiresAuth = response.status === 403; // Custom property for guest restriction
      throw error;
    }

    return await response.blob()
  } catch (error) {
    console.error("Error generating CV:", error)
    throw error; // Re-throw to be caught by the calling function
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

export default function CvProcess() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [guestRestriction, setGuestRestriction] = useState<{
    isRestricted: boolean
    guestInfo?: GuestInfo // Using the defined GuestInfo interface
    showModal: boolean
  }>({
    isRestricted: false,
    showModal: false,
  })

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

  // Load saved data on component mount
  useEffect(() => {
    const { data, step } = loadFromStorage()
    if (data) {
      setCvData(data)
      setCurrentStep(step)
      setLastSaved(new Date())
    }
    setIsDataLoaded(true)
  }, [])

  // Auto-save data whenever cvData or currentStep changes
  useEffect(() => {
    if (isDataLoaded) {
      saveToStorage(cvData, currentStep)
      setLastSaved(new Date())
    }
  }, [cvData, currentStep, isDataLoaded])

  // Check guest status on component mount
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
            };

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

  // Step configuration - Wrapped in useMemo to prevent re-creation on every render
  const steps = useMemo(() => [
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
  ], []); // Empty dependency array means this array is created once

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
      console.error("Invalid current step for validation:", currentStep);
      setValidationErrors(["Invalid step encountered."]);
      return false;
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

  // Function to validate and proceed to next step
  const validateAndProceed = useCallback(() => {
    // Removed setTimeout as it's generally not needed for state updates in React
    if (validateCurrentStep()) {
      nextStep()
    }
  }, [validateCurrentStep, nextStep])

  // Handle CV generation
  const handleGenerateCV = async () => {
    // Check guest restrictions before generating
    if (guestRestriction.isRestricted) {
      setGuestRestriction((prev) => ({ ...prev, showModal: true }))
      return
    }

    setIsLoading(true)
    try {
      const blob = await generateCV(cvData)
      if (blob) {
        setPdfBlob(blob)
        // Clear storage after successful generation
        clearStorage()
      } else {
        setValidationErrors(["Failed to generate CV. Please try again."])
      }
    } catch (error: unknown) { // Use unknown for safer type checking
      console.error("Error generating CV:", error);
      if (error instanceof Error) {
        // Safely check for custom properties on the error object
        const customError = error as { status?: number; requiresAuth?: boolean };
        if (customError.status === 403 && customError.requiresAuth) {
          setGuestRestriction((prev) => ({
            ...prev,
            isRestricted: true,
            showModal: true,
          }));
          setValidationErrors(["You need to be logged in or have sufficient guest credits to generate a CV."]);
        } else {
          setValidationErrors([error.message]);
        }
      } else {
        setValidationErrors(["An unexpected error occurred during CV generation."]);
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Download PDF function
  const downloadPDF = useCallback(() => {
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
  }, [pdfBlob, cvData.personalInfo.name]); // Added dependencies

  // Reset form
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
    setPdfBlob(null)
    setValidationErrors([])
  }, []); // Empty dependency array as it doesn't depend on any state

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
  const formSteps = useMemo(() => [
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
  ], [
    validateAndProceed, nextStep, prevStep, handleCvTypeChange, handlePersonalInfoChange,
    handleEducationChange, handleExperienceChange, handleSkillsChange, handleProjectsChange,
    handleCertificationsChange, handleLanguagesChange, handleJobPostChange, cvData // cvData is a dependency because initialData is passed to child components
  ]);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">CV Builder Progress</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {lastSaved && (
                  <>
                    <Save className="w-3 h-3" />
                    <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
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
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Step Indicator */}
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Steps</CardTitle>
                <p className="text-sm text-gray-600">{steps[currentStep]?.title}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                      index === currentStep
                        ? "bg-blue-50 border-2 border-blue-200"
                        : index < currentStep
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      // Allow navigation to completed steps or current step
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
                          <Button variant="outline" onClick={resetForm}>
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
      {/* Guest Restriction Modal */}
      <GuestRestrictionModal
        isOpen={guestRestriction.showModal}
        onClose={() => setGuestRestriction((prev) => ({ ...prev, showModal: false }))}
        guestInfo={guestRestriction.guestInfo}
      />
    </div>
  )
}
