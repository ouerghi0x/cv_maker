import prisma from "./prisma"
import { headers } from "next/headers"

// Get client IP address from request headers
export async function getClientIP(): Promise<string> {
  const headersList = await headers()

  // Try different headers in order of preference
  const forwardedFor = headersList.get("x-forwarded-for")
  const realIP = headersList.get("x-real-ip")
  const cfConnectingIP = headersList.get("cf-connecting-ip") // Cloudflare
  const xClientIP = headersList.get("x-client-ip")

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP
  if (xClientIP) return xClientIP

  return "127.0.0.1"
}

// Generate a simple browser fingerprint
export function generateFingerprint(userAgent?: string, acceptLanguage?: string): string {
  const components = [
    userAgent || "",
    acceptLanguage || "",
    // Add more components as needed
  ]

  // Simple hash function
  let hash = 0
  const str = components.join("|")
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

// Get or create guest usage record
export async function getGuestUsage(
  ip: string,
  fingerprint?: string,
): Promise<{
  id: number
  ip: string
  fingerprint: string | null
  location: string | null
  hasCreatedCV: boolean
  createdAt: Date
  expiresAt: Date | null
}> {
  // Clean up expired records first
  await cleanupExpiredGuests()

  // Try to find existing record
  let guestUsage = await prisma.guestUsage.findUnique({
    where: { ip },
  })

  // Create new record if doesn't exist
  if (!guestUsage) {
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours from now

    guestUsage = await prisma.guestUsage.create({
      data: {
        ip,
        fingerprint,
        expiresAt,
      },
    })
  }

  return guestUsage
}

// Check if guest can create CV
export async function canGuestCreateCV(ip: string): Promise<{
  canCreate: boolean
  reason?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  guestUsage?: any
}> {
  const guestUsage = await getGuestUsage(ip)

  if (guestUsage.hasCreatedCV) {
    return {
      canCreate: false,
      reason: "Guest has already created a CV",
      guestUsage,
    }
  }

  return {
    canCreate: true,
    guestUsage,
  }
}

// Mark guest as having created a CV
export async function markGuestCVCreated(ip: string): Promise<void> {
  await prisma.guestUsage.update({
    where: { ip },
    data: { hasCreatedCV: true },
  })
}

// Clean up expired guest records
export async function cleanupExpiredGuests(): Promise<void> {
  const now = new Date()

  await prisma.guestUsage.deleteMany({
    where: {
      expiresAt: {
        lte: now,
      },
    },
  })
}

// Optional: Get location from IP (you can integrate with a service like ipapi.co)
export async function getLocationFromIP(ip: string): Promise<string | null> {
  try {
    // Skip for localhost/development
    if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.")) {
      return "Local Development"
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    if (response.ok) {
      const data = await response.json()
      return `${data.city || "Unknown"}, ${data.country_name || "Unknown"}`
    }
  } catch (error) {
    console.error("Error getting location from IP:", error)
  }

  return null
}
