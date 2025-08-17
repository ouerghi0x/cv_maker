"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface User {
  email: string
}

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/me", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      localStorage.clear()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setMobileMenuOpen(false)
    }
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/makercv", label: "MakerCV" },
    { href: "/makercv/my-cvs", label: "My CVs" },
  ]

  return (
    <nav className="bg-white  border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify26
              justify-center transition-transform group-hover:scale-110"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-white font-bold text-lg">M</span>
            </motion.div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              MakerCV
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors relative",
                  "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5",
                  "after:bg-blue-600 after:scale-x-0 after:origin-right after:transition-transform",
                  "hover:after:scale-x-100 hover:after:origin-left"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold ring-2 ring-blue-100">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden lg:inline truncate max-w-[150px]">{user.email}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="hover:bg-blue-50 transition-colors"
                >
                  Logout
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Register
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t pt-4 pb-6"
            >
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md",
                      "hover:bg-blue-50 text-base font-medium"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  {isLoading ? (
                    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mx-3" />
                  ) : user ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-3"
                    >
                      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold ring-2 ring-blue-100">
                          {user.email[0].toUpperCase()}
                        </div>
                        <span className="truncate">{user.email}</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full hover:bg-blue-50 transition-colors"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3 px-3"
                    >
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-blue-50 transition-colors"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          Register
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}