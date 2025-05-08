"use client"

import { useRouter } from "next/navigation"
import { CreditCard, Check } from "lucide-react"

export default function PlanSelectionCard() {
  const router = useRouter()

  const handleProceed = () => {
    router.push("/payment/method-selection")
  }

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

        {/* Plan Details Box */}
        <div className="w-full rounded-lg bg-purple-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                </svg>
              </div>
              <div className="font-medium">
                Plan <span className="text-purple-600">$199/month</span>
              </div>
            </div>
            <Check className="h-5 w-5 text-purple-600" />
          </div>
          <ul className="mt-3 space-y-2 pl-6">
            <li className="flex items-start">
              <span className="mr-2 text-purple-600">•</span>
              <div>
                <span className="text-purple-600">AI-powered chatbot</span>
                <span className="text-gray-700"> tailored for wellness businesses.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600">•</span>
              <div>
                <span className="text-purple-600">Seamless integration</span>
                <span className="text-gray-700"> with your existing website.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600">•</span>
              <div>
                <span className="text-purple-600">24/7 customer support.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Proceed to Payment Button */}
        <button
          onClick={handleProceed}
          className="w-full rounded-md bg-black py-3 text-center text-white transition-colors hover:bg-black/90"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  )
}
