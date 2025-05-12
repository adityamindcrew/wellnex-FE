"use client"

import { useRouter } from "next/navigation"
import { CreditCard, Check } from "lucide-react"

export default function VerifyEmail() {
  const router = useRouter()

  

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center space-y-6">
        {/* Credit Card Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <CreditCard className="h-8 w-8 text-purple-600" />
        </div>

        {/* Heading and Subheading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">WellnexAI Pro Subscription</h1>
          <p className="text-gray-600">Secure your AI chatbot in just one step - your subscription begins today.</p>
        </div>

      
      </div>
    </div>
  )
}
