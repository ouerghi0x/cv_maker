"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, FolderOpen, ExternalLink } from "lucide-react"

type Project = {
  projectName: string
  description: string
  technologies: string
  link: string
  startDate: string
  endDate: string
}

type PersonalProjectsProps = {
  next: () => void
  prev: () => void
  onChange: (projects: Project[]) => void
  initialData?: Project[]
}

export default function PersonalProjects({ next, prev, onChange, initialData = [] }: PersonalProjectsProps) {
  const [projectEntries, setProjectEntries] = useState<Project[]>(initialData)
  const [currentEntry, setCurrentEntry] = useState<Project>({
    projectName: "",
    description: "",
    technologies: "",
    link: "",
    startDate: "",
    endDate: "",
  })

  const handleCurrentEntryChange = (field: keyof Project, value: string) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: value }))
  }

  const addProject = () => {
    if (
      currentEntry.projectName &&
      currentEntry.description &&
      currentEntry.technologies &&
      currentEntry.startDate &&
      currentEntry.endDate
    ) {
      setProjectEntries((prev) => [...prev, currentEntry])
      setCurrentEntry({ projectName: "", description: "", technologies: "", link: "", startDate: "", endDate: "" })
    }
  }

  const removeProject = (index: number) => {
    setProjectEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(projectEntries)
    next()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Projects</h2>
        <p className="text-gray-600">Showcase your personal and side projects</p>
      </div>

      <div className="space-y-6">
        {/* Existing Projects */}
        {projectEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Added Projects ({projectEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectEntries.map((project, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{project.projectName}</h4>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Technologies:</strong> {project.technologies}
                    </p>
                    <p className="text-sm text-gray-500">
                      {project.startDate} - {project.endDate}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Add New Project */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={currentEntry.projectName}
                    onChange={(e) => handleCurrentEntryChange("projectName", e.target.value)}
                    placeholder="e.g., E-commerce Website"
                  />
                </div>
                <div>
                  <Label htmlFor="link">Project Link</Label>
                  <Input
                    id="link"
                    type="url"
                    value={currentEntry.link}
                    onChange={(e) => handleCurrentEntryChange("link", e.target.value)}
                    placeholder="https://github.com/username/project"
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
                <Label htmlFor="technologies">Technologies Used *</Label>
                <Input
                  id="technologies"
                  value={currentEntry.technologies}
                  onChange={(e) => handleCurrentEntryChange("technologies", e.target.value)}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={currentEntry.description}
                  onChange={(e) => handleCurrentEntryChange("description", e.target.value)}
                  placeholder="Describe what the project does and your role in it..."
                  rows={4}
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={addProject}
              disabled={
                !currentEntry.projectName ||
                !currentEntry.description ||
                !currentEntry.technologies ||
                !currentEntry.startDate ||
                !currentEntry.endDate
              }
              className="w-full mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Project
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
