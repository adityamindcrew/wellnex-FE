"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function PaymentConfirmation() {
  const router = useRouter()

  const handleContinue = () => {
    router.push("/dashboard")
  }

  // Generate a random order number
  const orderNumber = `WNX-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`

  // Get current date for the order date
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Your Purchase is Complete!</h1>
          <p className="text-sm text-gray-600">
            Thank you for subscribing to WellnexAI Pro. Your account is now active.
          </p>
        </div>

        <div className="w-full rounded-md bg-purple-50 p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Order Number</span>
              <span>{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Date</span>
              <span>{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Plan</span>
              <span>WellnexAI Pro</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600">Amount</span>
              <span>$199/month</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full rounded-md bg-black py-3 text-center text-white transition-colors hover:bg-black/90"
        >
          Continue to Dashboard
          <ArrowRight className="ml-2 inline-block h-4 w-4" />
        </button>

        <p className="text-center text-xs text-gray-500">
          A receipt has been sent to your email. For any questions, contact{" "}
          <a href="mailto:support@wellnexai.com" className="text-purple-600 hover:underline">
            support@wellnexai.com
          </a>
        </p>
      </div>
    </div>
  )
}
