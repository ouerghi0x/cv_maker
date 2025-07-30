"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Award } from "lucide-react"

type Certification = {
  name: string
  issuingOrganization: string
  issueDate: string
  expirationDate?: string
}

type PersonalCertificationProps = {
  next: () => void
  prev: () => void
  onChange: (certifications: Certification[]) => void
  initialData?: Certification[]
}

export default function PersonalCertification({ next, prev, onChange, initialData = [] }: PersonalCertificationProps) {
  const [certificationEntries, setCertificationEntries] = useState<Certification[]>(initialData)
  const [currentEntry, setCurrentEntry] = useState<Certification>({
    name: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
  })

  const handleCurrentEntryChange = (field: keyof Certification, value: string) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: value }))
  }

  const addCertification = () => {
    if (currentEntry.name && currentEntry.issuingOrganization && currentEntry.issueDate) {
      setCertificationEntries((prev) => [...prev, currentEntry])
      setCurrentEntry({ name: "", issuingOrganization: "", issueDate: "", expirationDate: "" })
    }
  }

  const removeCertification = (index: number) => {
    setCertificationEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(certificationEntries)
    next()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Certifications</h2>
        <p className="text-gray-600">Add your professional certifications and licenses</p>
      </div>

      <div className="space-y-6">
        {/* Existing Certifications */}
        {certificationEntries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Award className="w-5 h-5" />
                Added Certifications ({certificationEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certificationEntries.map((cert, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{cert.name}</h4>
                    <p className="text-gray-600 truncate">{cert.issuingOrganization}</p>
                    <p className="text-sm text-gray-500">
                      Issued: {cert.issueDate}
                      {cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:text-red-700 ml-2 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Add New Certification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Add New Certification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Certification Name *</Label>
                <Input
                  id="name"
                  value={currentEntry.name}
                  onChange={(e) => handleCurrentEntryChange("name", e.target.value)}
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="issuingOrganization">Issuing Organization *</Label>
                <Input
                  id="issuingOrganization"
                  value={currentEntry.issuingOrganization}
                  onChange={(e) => handleCurrentEntryChange("issuingOrganization", e.target.value)}
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
              <div>
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="month"
                  value={currentEntry.issueDate}
                  onChange={(e) => handleCurrentEntryChange("issueDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                <Input
                  id="expirationDate"
                  type="month"
                  value={currentEntry.expirationDate}
                  onChange={(e) => handleCurrentEntryChange("expirationDate", e.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              onClick={addCertification}
              disabled={!currentEntry.name || !currentEntry.issuingOrganization || !currentEntry.issueDate}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
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
