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
    setFormData((prev) => ({ ...prev, [field]: value }))
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
      onChange(formData)
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map(({ key, label, icon: Icon, required, type }) => (
                <div key={key} className={key === "address" ? "md:col-span-2" : ""}>
                  <Label htmlFor={key} className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" />
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={key}
                    type={type}
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={errors[key] ? "border-red-500" : ""}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                  {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={prev}>
                Previous
              </Button>
              <Button type="submit">Save & Continue</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
