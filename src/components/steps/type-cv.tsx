"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TypeCVProps = {
  next: () => void
  onChange: (type: string) => void
  initialData?: string
}

const cvTypes = [
  { id: "software-engineer", label: "Software Engineer", description: "For developers and programmers" },
  { id: "data-scientist", label: "Data Scientist", description: "For data analysis and ML roles" },
  { id: "product-manager", label: "Product Manager", description: "For product and project management" },
  { id: "designer", label: "Designer", description: "For UI/UX and graphic designers" },
  { id: "marketing", label: "Marketing", description: "For marketing and growth roles" },
  { id: "sales", label: "Sales", description: "For sales and business development" },
  { id: "finance", label: "Finance", description: "For finance and accounting roles" },
  { id: "other", label: "Other", description: "Custom or other professions" },
]

export default function TypeCV({ next, onChange, initialData = "" }: TypeCVProps) {
  const [selectedType, setSelectedType] = useState(initialData)

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    // Call onChange immediately when selection is made
    onChange(typeId)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedType) {
      next()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-4 sm:mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Choose Your CV Type</h2>
      <p className="text-gray-600 text-sm sm:text-base">Select the type that best matches your career goals</p>
      </div>

      <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
        {cvTypes.map((type) => (
        <Card
          key={type.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
          selectedType === type.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
          }`}
          onClick={() => handleTypeSelect(type.id)}
        >
          <CardHeader className="pb-1">
          <CardTitle className="text-sm sm:text-base">{type.label}</CardTitle>
          </CardHeader>
          <CardContent>
          <p className="text-xs sm:text-sm text-gray-600">{type.description}</p>
          </CardContent>
        </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button type="submit" disabled={!selectedType} className="min-w-[100px] w-full sm:w-auto">
        Continue
        </Button>
      </div>
      </form>
    </div>
  )
}
