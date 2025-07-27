"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Briefcase } from "lucide-react"

type Experience = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

type PersonalExperienceProps = {
  next: () => void
  prev: () => void
  onChange: (experience: Experience[]) => void
  initialData?: Experience[]
}

export default function PersonalExperience({ next, prev, onChange, initialData = [] }: PersonalExperienceProps) {
  const [experienceEntries, setExperienceEntries] = useState<Experience[]>(initialData)
  const [currentEntry, setCurrentEntry] = useState<Experience>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const handleCurrentEntryChange = (field: keyof Experience, value: string) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: value }))
  }

  const addExperience = () => {
    if (
      currentEntry.company &&
      currentEntry.position &&
      currentEntry.startDate &&
      currentEntry.endDate &&
      currentEntry.description
    ) {
      setExperienceEntries((prev) => [...prev, currentEntry])
      setCurrentEntry({ company: "", position: "", startDate: "", endDate: "", description: "" })
    }
  }

  const removeExperience = (index: number) => {
    setExperienceEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(experienceEntries)
    next()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Work Experience</h2>
        <p className="text-gray-600">Add your professional experience</p>
      </div>

      <div className="space-y-6">
        {/* Existing Experience Entries */}
        {experienceEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Added Experience ({experienceEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {experienceEntries.map((exp, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{exp.description}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Add New Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={currentEntry.company}
                    onChange={(e) => handleCurrentEntryChange("company", e.target.value)}
                    placeholder="e.g., Google Inc."
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={currentEntry.position}
                    onChange={(e) => handleCurrentEntryChange("position", e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="month"
                    value={currentEntry.startDate}
                    onChange={(e) => handleCurrentEntryChange("startDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={currentEntry.endDate}
                    onChange={(e) => handleCurrentEntryChange("endDate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={currentEntry.description}
                  onChange={(e) => handleCurrentEntryChange("description", e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={4}
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={addExperience}
              disabled={
                !currentEntry.company ||
                !currentEntry.position ||
                !currentEntry.startDate ||
                !currentEntry.endDate ||
                !currentEntry.description
              }
              className="w-full mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
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
