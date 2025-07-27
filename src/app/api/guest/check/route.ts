import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getClientIP, generateFingerprint, canGuestCreateCV, getLocationFromIP } from "@/lib/guest-utils"

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const token = req.cookies.get("auth")?.value

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET as string)
        return NextResponse.json({
          isAuthenticated: true,
          canCreateCV: true,
        })
      } catch {
        // Token invalid, treat as guest
      }
    }

    // Handle guest user
    const ip = await getClientIP()
    const userAgent = req.headers.get("user-agent") || ""
    const acceptLanguage = req.headers.get("accept-language") || ""
    const fingerprint = generateFingerprint(userAgent, acceptLanguage)

    // Check if guest can create CV
    const { canCreate, reason, guestUsage } = await canGuestCreateCV(ip)

    // Optionally get location (can be cached for performance)
    let location = guestUsage?.location
    if (!location) {
      location = await getLocationFromIP(ip)
    }

    return NextResponse.json({
      isAuthenticated: false,
      canCreateCV: canCreate,
      reason,
      guestInfo: {
        ip: ip.substring(0, 8) + "***", // Partially hide IP for privacy
        fingerprint: fingerprint.substring(0, 8),
        location,
        hasCreatedCV: guestUsage?.hasCreatedCV || false,
        createdAt: guestUsage?.createdAt,
        expiresAt: guestUsage?.expiresAt,
      },
    })
  } catch (error) {
    console.error("Error checking guest status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
