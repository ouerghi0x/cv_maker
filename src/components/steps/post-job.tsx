"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileText } from "lucide-react"

type PostJobToPostuleForProps = {
  next: () => void
  prev: () => void
  onChange: (jobPost: string) => void
  initialData?: string
}

export default function PostJobToPostuleFor({ next, prev, onChange, initialData = "" }: PostJobToPostuleForProps) {
  const [jobPost, setJobPost] = useState(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(jobPost)
    next()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Target Job Position</h2>
        <p className="text-gray-600">Paste the job description you're applying for to optimize your CV</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="jobPost">Job Description (Optional)</Label>
              <p className="text-sm text-gray-600 mb-2">
                Paste the job posting here to help tailor your CV to the specific role
              </p>
              <Textarea
                id="jobPost"
                value={jobPost}
                onChange={(e) => setJobPost(e.target.value)}
                placeholder="Paste the job description here..."
                rows={12}
                className="min-h-[300px]"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-blue-800">
                Adding the job description helps our AI optimize your CV by highlighting relevant skills and experience
                that match the role requirements.
              </p>
            </div>

            <div className="flex justify-between">
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
