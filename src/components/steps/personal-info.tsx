"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"

type PersonalInfoData = {
  name: string
  email: string
  phone: string
  address: string
  linkedin: string
  github: string
  website: string
}

type PersonalInfoProps = {
  next: () => void
  prev: () => void
  onChange: (info: PersonalInfoData) => void
  initialData?: PersonalInfoData
}

const defaultData: PersonalInfoData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  linkedin: "",
  github: "",
  website: "",
}

export default function PersonalInfo({ next, prev, onChange, initialData = defaultData }: PersonalInfoProps) {
  const [formData, setFormData] = useState<PersonalInfoData>(initialData)
  const [errors, setErrors] = useState<Partial<PersonalInfoData>>({})

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)

    // Update parent immediately
    onChange(newFormData)

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PersonalInfoData> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      next()
    }
  }

  const inputFields = [
    { key: "name" as const, label: "Full Name", icon: User, required: true, type: "text" },
    { key: "email" as const, label: "Email Address", icon: Mail, required: true, type: "email" },
    { key: "phone" as const, label: "Phone Number", icon: Phone, required: true, type: "tel" },
    { key: "address" as const, label: "Address", icon: MapPin, required: true, type: "text" },
    { key: "linkedin" as const, label: "LinkedIn Profile", icon: Linkedin, required: false, type: "url" },
    { key: "github" as const, label: "GitHub Profile", icon: Github, required: false, type: "url" },
    { key: "website" as const, label: "Personal Website", icon: Globe, required: false, type: "url" },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2"> {/* Reduced overall vertical padding */}
  <div className="text-center mb-3 sm:mb-4"> {/* Further reduced bottom margin for title */}
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Personal Information</h2> {/* Slightly reduced title size */}
    <p className="text-sm text-gray-600">Tell us about yourself</p> {/* Slightly reduced subtitle size */}
  </div>

  <Card>
    <CardHeader className="py-3 sm:py-4"> {/* Reduced CardHeader vertical padding */}
      <CardTitle className="text-base sm:text-lg">Contact Details</CardTitle> {/* Slightly reduced card title size */}
    </CardHeader>
    <CardContent className="p-3 sm:p-4"> {/* Reduced CardContent padding */}
      <form onSubmit={handleSubmit} className="space-y-3"> {/* Further reduced vertical spacing between form groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"> {/* Reduced gap in the grid */}
          {inputFields.map(({ key, label, icon: Icon, required, type }) => (
            <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
              <Label htmlFor={key} className="flex items-center gap-1 mb-0.5 text-xs sm:text-sm"> {/* Reduced gap and bottom margin for label, smaller text */}
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" /> {/* Adjusted icon size for smaller text */}
                {label}
                {required && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={key}
                type={type}
                value={formData[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`text-sm py-1.5 px-2 ${errors[key] ? "border-red-500" : ""}`} 
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
              {errors[key] && <p className="text-red-500 text-xs mt-0.5">{errors[key]}</p>} {/* Adjusted error text size and margin */}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between pt-3 space-y-2 sm:space-y-0"> {/* Reduced top padding and space-y for buttons */}
          <Button type="button" variant="outline" onClick={prev} className="w-full sm:w-auto bg-transparent text-sm py-1.5 px-3"> {/* Reduced button padding and text size */}
            Previous
          </Button>
          <Button type="submit" className="w-full sm:w-auto text-sm py-1.5 px-3"> {/* Reduced button padding and text size */}
            Save & Continue
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</div>


  )
}
