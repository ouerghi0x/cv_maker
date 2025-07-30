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
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Choose Your CV Type</h2>
        <p className="text-gray-600">Select the type that best matches your career goals</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {cvTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedType === type.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">{type.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button type="submit" disabled={!selectedType} className="min-w-[120px] w-full sm:w-auto">
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
