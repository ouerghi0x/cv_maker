"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { FileText, Download } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } = from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CV {
  id: number
  cvType: string
  jobPost: string
  pdfcvUrl: string | null
  pdfcoverUrl: string | null
  createdAt: string
}

export default function CVHistoryPage() {
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCVs() {
      try {
        const res = await fetch("/api/user/cv-history", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setCvs(data.cvs)
        } else {
          setError("Failed to fetch CV history.")
        }
      } catch (err) {
        setError("An unexpected error occurred.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCVs()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <p>Loading CV history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your CV History</h1>

      {cvs.length === 0 ? (
        <p className="text-gray-600">You haven\'t created any CVs yet. Start by making one!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => (
            <Card key={cv.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-800">{cv.cvType} CV</CardTitle>
                <p className="text-sm text-gray-500">
                  Created on {format(new Date(cv.createdAt), "PPP")}
                </p>
              </CardHeader>
              <CardContent className="grid gap-4">
                {cv.jobPost && (
                  <p className="text-gray-700">
                    <span className="font-medium">Job Post:</span> {cv.jobPost}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {cv.pdfcvUrl && (
                    <Button asChild variant="outline" size="sm" className="group">
                      <a href={cv.pdfcvUrl} target="_blank" rel="noopener noreferrer" download
                         className="flex items-center text-blue-600 hover:underline">
                        <FileText className="w-4 h-4 mr-1" /> View CV
                        <Download className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    </Button>
                  )}
                  {cv.pdfcoverUrl && (
                    <Button asChild variant="outline" size="sm" className="group">
                      <a href={cv.pdfcoverUrl} target="_blank" rel="noopener noreferrer" download
                         className="flex items-center text-green-600 hover:underline">
                        <FileText className="w-4 h-4 mr-1" /> View Cover Letter
                        <Download className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    </Button>
                  )}
                </div>
                <Badge variant="secondary" className="w-fit">ID: {cv.id}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { FileText, Download } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CV {
  id: number
  cvType: string
  jobPost: string
  pdfcvUrl: string | null
  pdfcoverUrl: string | null
  createdAt: string
}

export default function CVHistoryPage() {
  const [cvs, setCvs] = useState<CV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCVs() {
      try {
        const res = await fetch("/api/user/cv-history", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setCvs(data.cvs)
        } else {
          setError("Failed to fetch CV history.")
        }
      } catch (err) {
        setError("An unexpected error occurred.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCVs()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <p>Loading CV history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your CV History</h1>

      {cvs.length === 0 ? (
        <p className="text-gray-600">You haven't created any CVs yet. Start by making one!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => (
            <Card key={cv.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-800">{cv.cvType} CV</CardTitle>
                <p className="text-sm text-gray-500">
                  Created on {format(new Date(cv.createdAt), "PPP")}
                </p>
              </CardHeader>
              <CardContent className="grid gap-4">
                {cv.jobPost && (
                  <p className="text-gray-700">
                    <span className="font-medium">Job Post:</span> {cv.jobPost}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {cv.pdfcvUrl && (
                    <Button asChild variant="outline" size="sm" className="group">
                      <a href={cv.pdfcvUrl} target="_blank" rel="noopener noreferrer" download
                         className="flex items-center text-blue-600 hover:underline">
                        <FileText className="w-4 h-4 mr-1" /> View CV
                        <Download className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    </Button>
                  )}
                  {cv.pdfcoverUrl && (
                    <Button asChild variant="outline" size="sm" className="group">
                      <a href={cv.pdfcoverUrl} target="_blank" rel="noopener noreferrer" download
                         className="flex items-center text-green-600 hover:underline">
                        <FileText className="w-4 h-4 mr-1" /> View Cover Letter
                        <Download className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    </Button>
                  )}
                </div>
                <Badge variant="secondary" className="w-fit">ID: {cv.id}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


