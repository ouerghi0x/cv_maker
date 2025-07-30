"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Award,
  Briefcase,
  Globe,
  User,
  Target,
  CheckCircle,
  Star,
  Zap,
  Shield,
  ArrowRight,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CVGallery from "@/components/ui/cvgallery"

export default function LandingPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to fetch user", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MakerCV</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="w-20 h-9 bg-gray-200 animate-pulse rounded"></div>
              ) : user ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">{user.email}</span>
                  </div>
                  <Link href="/makercv">
                    <Button>Go to CV Builder</Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                {user ? (
                  <>
                    <Badge variant="secondary" className="w-fit">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Welcome back, {user.email.split("@")[0]}!
                    </Badge>
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                      Ready to Create Your <span className="text-blue-600">Next</span>{" "}
                      <span className="text-purple-600">Professional CV?</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Continue building your professional CV or start a new one. Your previous work is saved and ready
                      to go!
                    </p>
                  </>
                ) : (
                  <>
                    <Badge variant="secondary" className="w-fit">
                      <Star className="w-4 h-4 mr-2" />
                      #1 CV Builder for Creative Professionals
                    </Badge>
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                      Create CVs That <span className="text-blue-600">Actually Get You</span>{" "}
                      <span className="text-purple-600">Hired</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Build stunning, customized CVs in minutes. Fill in your info, add your skills, and maybe...{" "}
                      <em className="text-purple-600 font-medium">enhance</em> your experience a little. We won&apos;t
                      tell if you won&apos;t! 😉
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link href="/makercv">
                      <Button size="lg" className="text-lg px-8">
                        <Zap className="w-5 h-5 mr-2" />
                        Continue Building CV
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 bg-transparent"
                      onClick={() => router.push("/makercv")}
                    >
                      Start New CV
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/makercv">
                      <Button size="lg" className="text-lg px-8">
                        <Zap className="w-5 h-5 mr-2" />
                        Try Demo Now
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {!user && (
                <div className="flex items-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No credit card required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Free forever plan
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="relative z-10 ">
                <CVGallery />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Everything You Need to Land Your Dream Job</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intuitive platform makes it easy to create professional CVs that stand out. Plus, we give you the
              creative freedom to... <em>optimize</em> your experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <User className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Add your contact details, professional summary, and personal brand. Make yourself sound as impressive
                  as you <em>could be</em>.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <Award className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Certifications & Education</CardTitle>
                <CardDescription>
                  Showcase your qualifications and achievements. That online course you took? Definitely counts as
                  &quot;advanced training.&quot;
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <Briefcase className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Projects & Experience</CardTitle>
                <CardDescription>
                  Highlight your work history and projects. That side project you started? It&apos;s now a
                  &quot;successful entrepreneurial venture.&quot;
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <Globe className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Languages & Skills</CardTitle>
                <CardDescription>
                  List your technical and soft skills. Remember, &quot;basic&quot; knowledge is just
                  &quot;proficient&quot; waiting to happen.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-colors">
              <CardHeader>
                <Target className="w-12 h-12 text-red-600 mb-4" />
                <CardTitle>Job Position Targeting</CardTitle>
                <CardDescription>
                  Customize your CV for specific roles. Our AI helps you match keywords and requirements perfectly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <Shield className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Professional Templates</CardTitle>
                <CardDescription>
                  Choose from dozens of ATS-friendly templates that make you look like the professional you&apos;re
                  destined to become.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">From Zero to Hero in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600">
              Creating your perfect CV has never been easier (or more... creative)
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold">Fill Your Information</h3>
              <p className="text-gray-600">
                Enter your details, experience, and skills. Don&apos;t worry about being 100% accurate - we&apos;re all
                about potential here!
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold">Choose Your Style</h3>
              <p className="text-gray-600">
                Select from our professional templates and customize colors, fonts, and layout to match your
                personality.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold">Download & Apply</h3>
              <p className="text-gray-600">
                Export your masterpiece as PDF and start applying to jobs with confidence (and maybe a little creative
                license).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include unlimited CV downloads and premium templates.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 hover:border-gray-300 transition-colors relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">Free</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  0 <span className="text-lg font-normal text-gray-600">TND</span>
                </div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">1 CV per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Basic templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">PDF download</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <div className="pt-6">
                  {user ? (
                    <Link href="/makercv">
                      <Button className="w-full bg-transparent" variant="outline">
                        Current Plan
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/register">
                      <Button className="w-full bg-transparent" variant="outline">
                        Get Started Free
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 hover:border-blue-600 transition-colors relative shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2 text-blue-600">Pro</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  15 <span className="text-lg font-normal text-gray-600">TND</span>
                </div>
                <CardDescription>Best for job seekers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Unlimited CVs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Premium templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">AI-powered optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Cover letter generator</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">LinkedIn integration</span>
                  </li>
                </ul>
                <div className="pt-6">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Upgrade to Pro</Button>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 hover:border-purple-300 transition-colors relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2 text-purple-600">Premium</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  25 <span className="text-lg font-normal text-gray-600">TND</span>
                </div>
                <CardDescription>For career professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Executive templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Personal branding kit</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Career coaching session</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">Interview preparation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">24/7 priority support</span>
                  </li>
                </ul>
                <div className="pt-6">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Go Premium</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing FAQ */}
          <div className="mt-16 text-center">
            <div className="bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Can I cancel anytime?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of
                    your billing period.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Do you offer refunds?</h4>
                  <p className="text-sm text-gray-600">
                    We offer a 7-day money-back guarantee for all paid plans. No questions asked.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h4>
                  <p className="text-sm text-gray-600">
                    We accept all major credit cards, PayPal, and local Tunisian payment methods.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Is my data secure?</h4>
                  <p className="text-sm text-gray-600">
                    Absolutely. We use enterprise-grade security and never share your personal information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            {user ? (
              <>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Build Your Next CV?</h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Your account is ready and your previous work is saved. Continue where you left off or start fresh with
                  a new CV!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/makercv">
                    <Button size="lg" variant="secondary" className="text-lg px-8">
                      Continue Building
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                    onClick={handleLogout}
                  >
                    Switch Account
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Transform Your Career?</h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Join thousands of professionals who&apos;ve already discovered the art of strategic CV enhancement.
                  Your dream job is just one click away!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/makercv">
                    <Button size="lg" variant="secondary" className="text-lg px-8">
                      Try Demo Free
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="text-lg px-8 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                    >
                      Start Building Now
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">MakerCV</span>
              </div>
              <p className="text-gray-400">
                Empowering professionals to create CVs that open doors. Sometimes you just need to open them a little
                wider.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="/makercv" className="hover:text-white transition-colors">
                    Try Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MakerCV. All rights reserved. Build responsibly... or not. 😉</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
