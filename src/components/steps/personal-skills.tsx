"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Zap } from "lucide-react"

type Skill = {
  skill: string
  proficiency: string
}

type PersonalSkillsProps = {
  next: () => void
  prev: () => void
  onChange: (skills: Skill[]) => void
  initialData?: Skill[]
}

const proficiencyLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
]

export default function PersonalSkills({ next, prev, onChange, initialData = [] }: PersonalSkillsProps) {
  const [skillEntries, setSkillEntries] = useState<Skill[]>(initialData)
  const [currentEntry, setCurrentEntry] = useState<Skill>({
    skill: "",
    proficiency: "",
  })

  const handleCurrentEntryChange = (field: keyof Skill, value: string) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = () => {
    if (currentEntry.skill && currentEntry.proficiency) {
      setSkillEntries((prev) => [...prev, currentEntry])
      setCurrentEntry({ skill: "", proficiency: "" })
    }
  }

  const removeSkill = (index: number) => {
    setSkillEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(skillEntries)
    next()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600">Add your technical and professional skills</p>
      </div>

      <div className="space-y-6">
        {/* Existing Skills */}
        {skillEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Zap className="w-5 h-5" />
                Added Skills ({skillEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skillEntries.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{skill.skill}</p>
                      <p className="text-sm text-gray-600 capitalize">{skill.proficiency}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-700 ml-2 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add New Skill */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Add New Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="skill">Skill Name *</Label>
                <Input
                  id="skill"
                  value={currentEntry.skill}
                  onChange={(e) => handleCurrentEntryChange("skill", e.target.value)}
                  placeholder="e.g., JavaScript, Project Management"
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
              onClick={addSkill}
              disabled={!currentEntry.skill || !currentEntry.proficiency}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </CardContent>
        </Card>

        {/* Navigation */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
            <Button type="button" variant="outline" onClick={prev} className="w-full sm:w-auto bg-transparent">
              Previous
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Save & Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
