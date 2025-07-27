import { NextResponse } from "next/server"
import { cleanupExpiredGuests } from "@/lib/guest-utils"

// This endpoint can be called by a cron job to clean up expired guest records
export async function POST() {
  try {
    await cleanupExpiredGuests()

    return NextResponse.json({
      success: true,
      message: "Expired guest records cleaned up successfully",
    })
  } catch (error) {
    console.error("Error cleaning up expired guests:", error)
    return NextResponse.json({ error: "Failed to cleanup expired guests" }, { status: 500 })
  }
}

// Also allow GET for easier testing
export async function GET() {
  return POST()
}
