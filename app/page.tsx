import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Video, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100">
      <main className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-gray-900">AnonymousChat</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-gray-900">
              Stay Anonymous,
              <br />
              Stay Connected
            </h2>
            <p className="text-xl text-gray-600">
              Connect with others through secure, anonymous text and video chat. No personal data required.
            </p>
            <div className="space-y-4">
              <Link href="/signup">
                <Button size="lg" className="w-full md:w-auto">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl" />
            <div className="relative bg-white p-8 rounded-3xl shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <FeatureCard
                  icon={<MessageSquare className="h-6 w-6" />}
                  title="Secure Messaging"
                  description="End-to-end encrypted messages that self-destruct"
                />
                <FeatureCard
                  icon={<Video className="h-6 w-6" />}
                  title="Anonymous Video"
                  description="Private video calls with no trace"
                />
                <FeatureCard
                  icon={<Shield className="h-6 w-6" />}
                  title="Privacy First"
                  description="No personal data stored"
                />
                <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-4 rounded-xl">
                  <div className="h-24 flex items-center justify-center">
                    <span className="text-sm text-gray-600 text-center">Join thousands of privacy-conscious users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

