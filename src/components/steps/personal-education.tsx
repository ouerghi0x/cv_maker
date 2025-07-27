"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, GraduationCap } from "lucide-react"

type Education = {
  degree: string
  institution: string
  yearStarted: string
  yearOfGraduation: string
}

type PersonalEducationProps = {
  next: () => void
  prev: () => void
  onChange: (education: Education[]) => void
  initialData?: Education[]
}

export default function PersonalEducation({ next, prev, onChange, initialData = [] }: PersonalEducationProps) {
  const [educationEntries, setEducationEntries] = useState<Education[]>(initialData)
  const [currentEntry, setCurrentEntry] = useState<Education>({
    degree: "",
    institution: "",
    yearStarted: "",
    yearOfGraduation: "",
  })

  const handleCurrentEntryChange = (field: keyof Education, value: string) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: value }))
  }

  const addEducation = () => {
    if (currentEntry.degree && currentEntry.institution && currentEntry.yearStarted && currentEntry.yearOfGraduation) {
      setEducationEntries((prev) => [...prev, currentEntry])
      setCurrentEntry({ degree: "", institution: "", yearStarted: "", yearOfGraduation: "" })
    }
  }

  const removeEducation = (index: number) => {
    setEducationEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(educationEntries)
    next()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Education</h2>
        <p className="text-gray-600">Add your educational background</p>
      </div>

      <div className="space-y-6">
        {/* Existing Education Entries */}
        {educationEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Added Education ({educationEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {educationEntries.map((edu, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {edu.yearStarted} - {edu.yearOfGraduation}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Add New Education */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Education</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  value={currentEntry.degree}
                  onChange={(e) => handleCurrentEntryChange("degree", e.target.value)}
                  placeholder="e.g., Bachelor of Science"
                />
              </div>
              <div>
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  value={currentEntry.institution}
                  onChange={(e) => handleCurrentEntryChange("institution", e.target.value)}
                  placeholder="e.g., University of Example"
                />
              </div>
              <div>
                <Label htmlFor="yearStarted">Year Started *</Label>
                <Input
                  id="yearStarted"
                  type="number"
                  value={currentEntry.yearStarted}
                  onChange={(e) => handleCurrentEntryChange("yearStarted", e.target.value)}
                  placeholder="e.g., 2019"
                />
              </div>
              <div>
                <Label htmlFor="yearOfGraduation">Year of Graduation *</Label>
                <Input
                  id="yearOfGraduation"
                  type="number"
                  value={currentEntry.yearOfGraduation}
                  onChange={(e) => handleCurrentEntryChange("yearOfGraduation", e.target.value)}
                  placeholder="e.g., 2023"
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={addEducation}
              disabled={
                !currentEntry.degree ||
                !currentEntry.institution ||
                !currentEntry.yearStarted ||
                !currentEntry.yearOfGraduation
              }
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>

        {/* Navigation */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={prev}>
              Previous
            </Button>
            <Button type="submit">Save & Continue</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
