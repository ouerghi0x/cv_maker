"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, UserPlus, LogIn, Clock, MapPin } from "lucide-react"
import Link from "next/link"

type GuestRestrictionModalProps = {
  isOpen: boolean
  onClose: () => void
  guestInfo?: {
    ip: string
    location?: string
    hasCreatedCV: boolean
    createdAt?: string
    expiresAt?: string
  }
}

export default function GuestRestrictionModal({ isOpen, onClose, guestInfo }: GuestRestrictionModalProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeUntilExpiry = (expiresAt?: string) => {
    if (!expiresAt) return null

    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    return `${minutes}m remaining`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">Free Trial Used</DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            You&apos;ve already created a CV as a guest user. To continue using MakerCV and create unlimited CVs, please sign
            up for a free account.
          </DialogDescription>
        </DialogHeader>

        {/* Guest Info */}
        {guestInfo && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Your Session Info:</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span>IP Address:</span>
                <Badge variant="secondary" className="text-xs">
                  {guestInfo.ip}
                </Badge>
              </div>
              {guestInfo.location && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    Location:
                  </span>
                  <span>{guestInfo.location}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>CV Created:</span>
                <span>{formatDate(guestInfo.createdAt)}</span>
              </div>
              {guestInfo.expiresAt && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Reset:
                  </span>
                  <span className="text-orange-600 font-medium">{getTimeUntilExpiry(guestInfo.expiresAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Benefits of signing up */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 text-sm mb-2">✨ Free Account Benefits:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Create unlimited CVs</li>
            <li>• Save and edit your CVs anytime</li>
            <li>• Access to premium templates</li>
            <li>• Cloud storage for your data</li>
            <li>• Priority customer support</li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-col space-y-2">
          <Link href="/register" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Free Account
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              <LogIn className="w-4 h-4 mr-2" />I Already Have an Account
            </Button>
          </Link>
          <Button variant="ghost" onClick={onClose} className="w-full text-gray-500">
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
