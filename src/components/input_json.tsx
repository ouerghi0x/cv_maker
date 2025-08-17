import { CVData } from "@/lib/type"

type Props = {
  onChangeCV: (json: CVData) => void
  hide: (e: boolean) => void
  setCurrentStep: (e: number) => void
}

export function InputJson({ onChangeCV, hide, setCurrentStep }: Props) {
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value.trim()
    if (!value) return
    try {
      const parsed: CVData = JSON.parse(value)
      onChangeCV(parsed)
      setCurrentStep(9)
    } catch (err) {
      console.error("Invalid JSON:", err)
    }
  }

  return (
    <div
      className="fixed top-20 left-1/2 z-50 w-1/3 transform -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl flex flex-col"
    >
      {/* Close Button */}
      <button
        onClick={() => hide(false)}
        className="self-end text-gray-500 hover:text-gray-800 font-bold text-lg"
      >
        ×
      </button>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Add CV Data (JSON format)
      </label>

      <p className="text-xs text-gray-500 mb-2">
        Enter your CV data as valid JSON. Include your job type, personal info, education, experience, skills, and optional fields like projects, certifications, and languages.
      </p>

      <pre className="bg-gray-100 p-2 rounded-lg text-xs font-mono overflow-auto mb-2">
{`{
  "cvType": "Full Stack Developer",
  "personalInfo": {
    "name": "Your Name",
    "email": "you@example.com",
    "phone": "12345678"
  },
  "education": [],
  "experience": [],
  "skills": [],
  "projects": [],
  "certifications": [],
  "languages": []
}`}
      </pre>

      <textarea
        rows={12}
        placeholder={`Paste your CV JSON here...`}
        onChange={handleChange}
        className="w-full border rounded-lg p-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <p className="text-xs text-gray-500 mt-2">
        Paste or type your CV data in valid JSON format.  
        It will replace your current CV state.
      </p>
    </div>
  )
}
