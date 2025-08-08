"use client"

import Image from "next/image"
import { X, CreditCard, User, Smartphone, Mail, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type D17InfoProps = {
  setD17Info: (value: boolean) => void
}

export default function MyD17Info({ setD17Info }: D17InfoProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      >
        <div className="flex items-start bg-amber-50 border border-amber-300 rounded-xl shadow-lg p-6 space-x-5 relative">
          {/* Close Button */}
          <button
            onClick={() => setD17Info(false)}
            className="absolute top-3 right-3 text-amber-700 hover:text-amber-900 rounded-full p-1 transition-colors"
            aria-label="Close Alert"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Profile Image */}
          <Image
            src="/profile.png"
            alt="my profile"
            width={56}
            height={56}
            className="rounded-full border border-amber-300 flex-shrink-0"
          />

          {/* Payment Info */}
          <div className="text-sm text-amber-900 leading-relaxed flex-grow">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 mr-2 text-amber-700" />
              <p className="text-base font-semibold">Pay via D17 or at any Bureau de Poste</p>
            </div>

            <div className="space-y-1">
              <p className="flex items-center">
                <User className="h-4 w-4 mr-2 text-amber-600" />
                <strong>Recipient:</strong> Mohamed Aziz Ouerghi
              </p>
              <p>
                <strong>CIN:</strong> 14656747
              </p>
              <p className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2 text-amber-600" />
                <strong>Phone Number (D17):</strong> +216 29 836 507
              </p>
            </div>

            <p className="mt-3 text-amber-800">
              <span className="font-medium">After payment, please send a</span>{" "}
              <strong className="font-semibold">screenshot or receipt</strong> <span className="font-medium">to:</span>
            </p>

            <p className="font-semibold flex items-center mt-1">
              <Mail className="h-4 w-4 mr-2 text-amber-600" />
              werghia.1@gmail.com
            </p>

            <a
              href="https://wa.me/21629836507"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold flex items-center mt-2 text-green-700 hover:text-green-800 transition"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              Send via WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
