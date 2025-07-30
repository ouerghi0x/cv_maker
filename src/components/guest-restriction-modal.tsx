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
import { AlertTriangle, Clock, MapPin, User } from "lucide-react"
import Link from "next/link"

interface GuestInfo {
  ip: string
  location?: string
  hasCreatedCV: boolean
  createdAt?: string
  expiresAt?: string
  cvCount?: number
  maxCvAllowed?: number
}

interface GuestRestrictionModalProps {
  isOpen: boolean
  onClose: () => void
  guestInfo?: GuestInfo
}

export default function GuestRestrictionModal({ isOpen, onClose, guestInfo }: GuestRestrictionModalProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            Guest Limit Reached
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            You&apos;ve reached the limit for guest CV generation. Create an account to continue building unlimited CVs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Guest Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 mb-3">Guest Session Info</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">IP:</span>
                <span className="font-mono text-gray-900">{guestInfo?.ip || "Unknown"}</span>
              </div>

              {guestInfo?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Location:</span>
                  <span className="text-gray-900">{guestInfo.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Session Started:</span>
                <span className="text-gray-900">{formatTime(guestInfo?.createdAt)}</span>
              </div>

              {guestInfo?.expiresAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Expires:</span>
                  <span className="text-gray-900">{formatTime(guestInfo.expiresAt)}</span>
                </div>
              )}
            </div>

            {/* CV Usage Stats */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CVs Generated:</span>
                <Badge variant={guestInfo?.hasCreatedCV ? "destructive" : "secondary"}>
                  {guestInfo?.cvCount || 0} / {guestInfo?.maxCvAllowed || 1}
                </Badge>
              </div>
            </div>
          </div>

          {/* Benefits of Creating Account */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">✨ Create Account Benefits</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Unlimited CV generation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Save and edit your CVs anytime
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Access to premium templates
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                AI-powered CV optimization
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            Continue as Guest
          </Button>
          <Link href="/register" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Create Free Account</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
