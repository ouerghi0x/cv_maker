"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface AddButtonProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export default function AddButton({ onClick, disabled = false, children, className = "" }: AddButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 ${className}`}
    >
      <Plus className="w-4 h-4" />
      {children}
    </Button>
  )
}
