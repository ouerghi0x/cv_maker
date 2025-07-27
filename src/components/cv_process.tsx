'use client';

import { useEffect, useState } from "react";
import PersonalCertification from "./personal_certification";
import PersonalInfo from "./personal_info";
import StepIndicator from "./StepIndicator"; // Import the new StepIndicator component
import PersonalEducation from "./PersonalEducation";
import PersonalExperience from "./personal_experience";
import PersonalSkills from "./personalskills";
import PersonalProjects from "./PersonalProjects";
import TypeCV from "./type_cv";
import PersonalLanguages from "./PersonalLangues";
import PostJobToPostuleFor from "./postjob";

// Define specific types for each data section
type PersonalInfoData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
};

type Education = {
  degree: string;
  institution: string;
  yearStarted: string;
  yearOfGraduation: string;
};

type Experience = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Skill = {
  skill: string;
  proficiency: string;
};

type Project = {
  projectName: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
};

type Certification = {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
};

type Language = {
  language: string;
  proficiency: string;
};

// Define the overall data structure for the CV with specific types
type CVData = {
  cvType: string; // Renamed 'type' to 'cvType' to avoid conflict with JS 'type' keyword
  personalInfo: PersonalInfoData;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  jobPost: string;
};

async function sendDataToAPI(data: string): Promise<Blob | null> {
  try {
    const response = await fetch('/api/generate-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error(error);
    return null;
  }
}



export default function CvMAKEME() {
  const [step, setStep] = useState(9); // Start at step 0 for the "Click to start" screen
  const exampleCVData = {
  cvType: "Software Engineer",
  personalInfo: {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Elm Street, San Francisco, CA",
    linkedin: "https://linkedin.com/in/sarahjohnson",
    github: "https://github.com/sjohnson-dev",
    website: "https://sarahjohnson.dev"
  },
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      yearStarted: "2015",
      yearOfGraduation: "2019"
    },
    {
      degree: "Master of Science in Artificial Intelligence",
      institution: "MIT",
      yearStarted: "2020",
      yearOfGraduation: "2022"
    }
  ],
  experience: [
    {
      company: "Google",
      position: "Frontend Engineer",
      startDate: "June 2022",
      endDate: "Present",
      description: "Developed scalable UI components using React and improved page load speed by 30%."
    },
    {
      company: "Facebook",
      position: "Software Engineering Intern",
      startDate: "June 2021",
      endDate: "Sept 2021",
      description: "Built internal tools for performance tracking in React and TypeScript."
    }
  ],
  skills: [
    { skill: "JavaScript", proficiency: "Expert" },
    { skill: "React", proficiency: "Advanced" },
    { skill: "Node.js", proficiency: "Advanced" },
    { skill: "Python", proficiency: "Intermediate" },
    { skill: "Docker", proficiency: "Intermediate" }
  ],
  projects: [
    {
      projectName: "DevConnect",
      description: "A professional networking platform for developers.",
      technologies: "Next.js, MongoDB, Tailwind CSS",
      link: "https://devconnect.app",
      startDate: "Jan 2023",
      endDate: "June 2023"
    },
    {
      projectName: "AI Resume Builder",
      description: "Generates optimized resumes using OpenAI APIs.",
      technologies: "React, OpenAI API, Express.js",
      link: "https://resumebuilder.ai",
      startDate: "July 2023",
      endDate: "Oct 2023"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer – Associate",
      issuingOrganization: "Amazon Web Services",
      issueDate: "March 2022"
    },
    {
      name: "Certified Kubernetes Application Developer (CKAD)",
      issuingOrganization: "Linux Foundation",
      issueDate: "August 2023"
    }
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Professional" },
    { language: "French", proficiency: "Intermediate" }
  ],
  jobPost: `We’re hiring a Frontend Engineer with experience in modern JavaScript frameworks, strong UI/UX instincts, and a passion for performance and accessibility. Bonus if you have experience in AI tooling or SaaS platforms.`
};
  const [loading, setLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const [data, setData] = useState<CVData>(
    {
      cvType: '', // Initialize cvType
      personalInfo: {
        name: '', email: '', phone: '', address: '',
        linkedin: '', github: '', website: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      jobPost: ''
    }
  );

  // Generic function to update a specific section of the CV data
  const updateData = <K extends keyof CVData>(sectionName: K, newData: CVData[K]) => {
    setData(prev => ({
      ...prev,
      [sectionName]: newData
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Define titles for each step, including the initial "Start" screen
  const stepTitles = [
    "Start",
    "CV Type", // Renamed for clarity
    "Personal Information",
    "Education",
    "Experience",
    "Skills",
    "Projects",
    "Certifications", // Moved certifications after projects for a more logical flow
    "Languages",
    "Job Post",
    "Generate CV" // Final step for generation
  ];

  // Array of components for each step of the form (index 0 is the actual first form step)
  const formSteps = [
    <TypeCV
      key="type-cv-step"
      next={nextStep}
      
      onChange={(typeValue) => updateData('cvType', typeValue)} // Update 'cvType'
      initialData={data.cvType}
    />,
    <PersonalInfo
      key="personal-info-step"
      next={nextStep}
      prev={prevStep} // PersonalInfo needs prev prop for navigation
      onChange={(key,info) => updateData('personalInfo', info)} // Corrected onChange signature
      initialData={data.personalInfo}
    />,
    <PersonalEducation
      key="personal-education-step"
      next={nextStep}
      prev={prevStep}
      onChange={(edu) => updateData('education', edu)}
      initialData={data.education}
    />,
    <PersonalExperience
      key="personal-experience-step"
      next={nextStep}
      prev={prevStep}
      onChange={(exp) => updateData('experience', exp)}
      initialData={data.experience}
    />,
    <PersonalSkills
      key="personal-skills-step"
      next={nextStep}
      prev={prevStep}
      onChange={(key,skills) => updateData('skills', skills)} // Corrected onChange signature
      initialData={data.skills}
    />,
    <PersonalProjects
      key="personal-projects-step"
      next={nextStep}
      prev={prevStep}
      onChange={(projects) => updateData('projects', projects)}
      initialData={data.projects}
    />,
    <PersonalCertification // Moved to a later step
      key="personal-certification-step"
      next={nextStep}
      prev={prevStep}
      onChange={(certs) => updateData('certifications', certs)}
      initialData={data.certifications}
    />,
    <PersonalLanguages
      key="personal-languages-step"
      next={nextStep}
      prev={prevStep}
      onChange={(languages) => updateData('languages', languages)}
      initialData={data.languages}
    />,
    <PostJobToPostuleFor
      key="job-post-step"
      next={nextStep}
      prev={prevStep}
      onChange={(post) => updateData('jobPost', post)}
      initialData={data.jobPost}
    />,
    <>
    <div key="summary" className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">CV Generation</h2>
      <p className="text-gray-700 mb-4">You have provided all the necessary information. Click the button below to generate your CV!</p>
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >Previous</button>
        <button
          onClick={async () => {
            setLoading(true);
            const pdf = await sendDataToAPI(JSON.stringify(exampleCVData));
            if (pdf) {
            setPdfBlob(pdf);
            } else {
            // handle error
            }
            setLoading(false);
            nextStep();
          }}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          disabled={loading}
        >{loading ? "Generating..." : "Generate CV"}</button>
      </div>
    </div>
    </>
    
    ,
  ];
  useEffect(() => {
  if (!pdfBlob) return;
  const url = URL.createObjectURL(pdfBlob);
  return () => URL.revokeObjectURL(url);
}, [pdfBlob]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-[Inter]">
      {/* Initial "Click to start" screen */}
      {step === 0 && (
        <div
          onClick={nextStep}
          className="cursor-pointer text-center text-indigo-600 font-bold text-lg mb-8 p-4 rounded-lg shadow-md bg-white hover:bg-indigo-50 transition-colors duration-200"
        >
          Click Here To Start Creating Your CV
        </div>
      )}

      {/* Main content area: Sidebar + Form + PDF Viewer */}
      {step > 0 && (
        <div className="flex w-full max-w-full h-[calc(100vh-4rem)]"> {/* Adjusted height to fill screen, minus some margin */}
          {/* Left Section: Sidebar */}
          <StepIndicator currentStep={step} stepTitles={stepTitles} />

          {/* Middle Section: Current Form Component */}
          <div className="flex-1 p-4 overflow-y-auto"> {/* Added overflow-y-auto for scrolling if content is long */}
            {formSteps[step - 1]} {/* Access formSteps array using step - 1 because step 0 is the "start" screen */}
          </div>

          {/* Right Section: Empty Div for PDF Viewer */}
            {pdfBlob ? (
            <>
                <iframe
                src={URL.createObjectURL(pdfBlob)}
                width="100%"
                height="600px"
                className="border rounded-md"
                title="Generated CV PDF"
                />
                <a
                href={URL.createObjectURL(pdfBlob)}
                download="cv.pdf"
                className="block mt-4 text-indigo-600 underline"
                >
                Download PDF
                </a>
            </>
            ) : (
            <div className="h-full text-center text-gray-400">Your CV PDF will appear here.</div>
            )}

        </div>
      )}

      
    </div>
  );
}
