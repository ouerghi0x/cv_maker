"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, User, FileText, Send, Edit3, Eye, Paperclip, CheckCircle2, Sparkles, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { type EmailFormData, emailSchema } from "@/lib/validations"
import RichTextEditor from "./rich-text-editor"
import { EmailProps } from "@/lib/type"

interface EmailTemplateProps {
  initialData: EmailProps
  pdfBlobs?: string[]
}

export default function EmailTemplate({ initialData,pdfBlobs }: EmailTemplateProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showEmailBody, setShowEmailBody] = useState(true)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      destinationEmail: initialData.destinationEmail || "",
      senderEmail: initialData.senderEmail || "",
      emailSubject: initialData.emailSubject || "",
      emailBody: initialData.emailBody || "",
      cvFile: initialData.cvFile ? true: false,
      coverLetter: initialData.coverLetter ? true : false,
    },
    mode: "onChange",
  })

  const watchedValues = watch()

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }

  const handleGenerateAgain = async () => {
    setIsGenerating(true)
    try {
      // Simulate API call to regenerate content
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock generated content
      const generatedContent = {
        emailSubject: "Application for Software Developer Position - [Your Name]",
        emailBody: `<p>Dear Hiring Manager,</p>
        <p>I am writing to express my strong interest in the Software Developer position at your company. With my background in full-stack development and passion for creating innovative solutions, I believe I would be a valuable addition to your team.</p>
        <p>Key highlights of my experience include:</p>
        <ul>
          <li>5+ years of experience with React, Next.js, and TypeScript</li>
          <li>Strong background in modern web development practices</li>
          <li>Experience with cloud platforms and DevOps</li>
        </ul>
        <p>I have attached my resume and cover letter for your review. I would welcome the opportunity to discuss how my skills and experience align with your needs.</p>
        <p>Thank you for your time and consideration.</p>
        <p>Best regards,<br>[Your Name]</p>`,
      }

      setValue("emailSubject", generatedContent.emailSubject)
      setValue("emailBody", generatedContent.emailBody)

      toast({
        title: "✨ Content Generated!",
        description: "New email content has been generated successfully.",
      })
    } catch {
      toast({
        title: "Generation Failed",
        description: "Failed to generate new content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const onSubmit = async (data: EmailFormData) => {
    setIsSending(true)
    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1500))
      fetch('/api/sendEmail', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            destinationEmail: data.destinationEmail,
            senderEmail: data.senderEmail,
            emailSubject: data.emailSubject,
            emailBody: data.emailBody,
            cvFile: data.cvFile,
            coverLetter: data.coverLetter,
          },
          pdfBlobs: pdfBlobs || [],
        }),
      })

      toast({
        title: "🚀 Email Sent Successfully!",
        description: `Email sent to ${data.destinationEmail}`,
      })
    } catch (error:unknown) {
      toast({
        title: "Failed to Send Email",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-4">
            {/* Reorganized buttons in single row */}
            <div className="flex items-center justify-between gap-2 w-full">
              {/* Left side buttons */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!isValid || isSending}
                  onClick={handleSubmit(onSubmit)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                >
                  <AnimatePresence mode="wait">
                    {isSending ? (
                      <motion.div
                        key="sending"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Sending...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="send"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Send Email
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>

                <Button
                  onClick={toggleEditing}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950 bg-transparent shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isEditing ? (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </>
                  )}
                </Button>
              </div>

              {/* Right side button */}
              <Button
                onClick={handleGenerateAgain}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Generate New Content
                  </>
                )}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <form className="space-y-4">
              {/* Email Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Destination Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Mail className="w-3 h-3 mr-1 text-blue-500" />
                    To
                  </Label>
                  {isEditing ? (
                    <div>
                      <Input
                        {...register("destinationEmail")}
                        type="email"
                        placeholder="recipient@example.com"
                        className="h-9 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 border-slate-200 dark:border-slate-700"
                      />
                      {errors.destinationEmail && (
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                          {errors.destinationEmail.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={toggleEditing}
                      className="cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md p-2 h-9 flex items-center transition-all duration-200 hover:shadow-md text-sm"
                    >
                      {watchedValues.destinationEmail || (
                        <span className="text-muted-foreground">No destination email</span>
                      )}
                    </div>
                  )}
                </motion.div>

                {/* Sender Email */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <User className="w-3 h-3 mr-1 text-green-500" />
                    From
                  </Label>
                  {isEditing ? (
                    <div>
                      <Input
                        {...register("senderEmail")}
                        type="email"
                        placeholder="your@example.com"
                        className="h-9 text-sm transition-all duration-200 focus:ring-2 focus:ring-green-500 border-slate-200 dark:border-slate-700"
                      />
                      {errors.senderEmail && (
                        <p className="text-xs text-red-500 mt-1 flex items-center">
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                          {errors.senderEmail.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={toggleEditing}
                      className="cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md p-2 h-9 flex items-center transition-all duration-200 hover:shadow-md text-sm"
                    >
                      {watchedValues.senderEmail || <span className="text-muted-foreground">No sender email</span>}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Subject */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <FileText className="w-3 h-3 mr-1 text-orange-500" />
                  Subject
                </Label>
                {isEditing ? (
                  <div>
                    <Input
                      {...register("emailSubject")}
                      placeholder="Enter email subject"
                      className="h-9 text-sm transition-all duration-200 focus:ring-2 focus:ring-orange-500 border-slate-200 dark:border-slate-700"
                    />
                    {errors.emailSubject && (
                      <p className="text-xs text-red-500 mt-1 flex items-center">
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                        {errors.emailSubject.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={toggleEditing}
                    className="cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md p-2 h-9 flex items-center transition-all duration-200 hover:shadow-md text-sm"
                  >
                    {watchedValues.emailSubject || <span className="text-muted-foreground">No subject</span>}
                  </div>
                )}
              </motion.div>

              {/* Email Body */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <FileText className="w-3 h-3 mr-1 text-purple-500" />
                    Email Body
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmailBody(!showEmailBody)}
                    className="text-xs h-6 px-2"
                  >
                    {showEmailBody ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3 h-3 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </div>

                <AnimatePresence>
                  {showEmailBody && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isEditing ? (
                        <div>
                          <RichTextEditor
                            content={watchedValues.emailBody}
                            onChange={(content) => setValue("emailBody", content)}
                            className="border-slate-200 dark:border-slate-700"
                          />
                          {errors.emailBody && (
                            <p className="text-xs text-red-500 mt-1 flex items-center">
                              <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                              {errors.emailBody.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div
                          onClick={toggleEditing}
                          className="cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md p-3 min-h-[120px] transition-all duration-200 hover:shadow-md text-sm"
                          dangerouslySetInnerHTML={{
                            __html:
                              watchedValues.emailBody ||
                              "<span class='text-muted-foreground'>No email body content</span>",
                          }}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Attachments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <Label className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Paperclip className="w-3 h-3 mr-1 text-indigo-500" />
                  Attachments
                </Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cvFile"
                      checked={watchedValues.cvFile}
                      onCheckedChange={(checked) => setValue("cvFile", !!checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="cvFile" className="flex items-center cursor-pointer text-xs font-medium">
                      <FileText className="w-3 h-3 mr-1 text-blue-600" />
                      CV/Resume
                    </Label>
                    {watchedValues.cvFile && (
                      <Badge
                        variant="secondary"
                        className="ml-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-1 py-0"
                      >
                        <CheckCircle2 className="w-2 h-2 mr-1" />
                        Attached
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="coverLetter"
                      checked={watchedValues.coverLetter}
                      onCheckedChange={(checked) => setValue("coverLetter", !!checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="coverLetter" className="flex items-center cursor-pointer text-xs font-medium">
                      <FileText className="w-3 h-3 mr-1 text-purple-600" />
                      Cover Letter
                    </Label>
                    {watchedValues.coverLetter && (
                      <Badge
                        variant="secondary"
                        className="ml-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-1 py-0"
                      >
                        <CheckCircle2 className="w-2 h-2 mr-1" />
                        Attached
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
