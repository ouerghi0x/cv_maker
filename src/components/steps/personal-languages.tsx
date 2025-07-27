"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Languages } from "lucide-react"

type Language = {
  language: string
  proficiency: string
}

type PersonalLanguagesProps = {
  next: () => void
  prev: () => void
  onChange: (languages: Language[]) => void
  initialData?: Language[]
}

const proficiencyLevels = [
  { value: "basic", label: "Basic" },
  { value: "conversational", label: "Conversational" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
]

export default function PersonalLanguages({ next, prev, onChange, initialData = [] }: PersonalLanguagesProps) {
  const [languageEntries, setLanguageEntries] = useState<Language[]>(initialData)
  const [currentEntry, setCurrentEntry] = useState<Language>({
    language: "",
    proficiency: "",
  })

  const handleCurrentEntryChange = (field: keyof Language, value: string) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: value }))
  }

  const addLanguage = () => {
    if (currentEntry.language && currentEntry.proficiency) {
      setLanguageEntries((prev) => [...prev, currentEntry])
      setCurrentEntry({ language: "", proficiency: "" })
    }
  }

  const removeLanguage = (index: number) => {
    setLanguageEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(languageEntries)
    next()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Languages</h2>
        <p className="text-gray-600">Add the languages you speak</p>
      </div>

      <div className="space-y-6">
        {/* Existing Languages */}
        {languageEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Added Languages ({languageEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {languageEntries.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{lang.language}</p>
                      <p className="text-sm text-gray-600 capitalize">{lang.proficiency}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Language */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Language</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="language">Language *</Label>
                <Input
                  id="language"
                  value={currentEntry.language}
                  onChange={(e) => handleCurrentEntryChange("language", e.target.value)}
                  placeholder="e.g., Spanish, French, Mandarin"
                />
              </div>
              <div>
                <Label htmlFor="proficiency">Proficiency Level *</Label>
                <Select
                  value={currentEntry.proficiency}
                  onValueChange={(value) => handleCurrentEntryChange("proficiency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="button"
              onClick={addLanguage}
              disabled={!currentEntry.language || !currentEntry.proficiency}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Language
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
