import { z } from "zod"

export const emailSchema = z.object({
  destinationEmail: z.string().min(1, "Destination email is required").email("Please enter a valid email address"),
  senderEmail: z.string().min(1, "Sender email is required").email("Please enter a valid email address"),
  emailSubject: z.string().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  emailBody: z
    .string()
    .min(10, "Email body must be at least 10 characters")
    .max(5000, "Email body must be less than 5000 characters"),
  cvFile: z.boolean().default(false),
  coverLetter: z.boolean().default(false),
})

export type EmailFormData = z.infer<typeof emailSchema>
