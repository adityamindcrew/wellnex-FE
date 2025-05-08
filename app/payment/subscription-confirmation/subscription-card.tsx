"use client"

import { useRouter } from "next/navigation"
import { CreditCard, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SubscriptionCard() {
  const router = useRouter()

  const handleProceed = () => {
    router.push("/payment/payment-method?plan=enterprise")
  }

  return (
    <div className="w-full max-w-md rounded-md border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-[#9747FF]">
          <CreditCard className="h-6 w-6" />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-black">WellnexAI Pro Subscription</h1>
          <p className="text-sm text-gray-600">
            Secure your AI chatbot in just one step - your subscription begins today.
          </p>
        </div>

        <div className="w-full rounded-md bg-[#F4EEFF] p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Plan $199/month</div>
            <Check className="h-5 w-5 text-[#9747FF]" />
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-[#9747FF]">•</span>
              <span>
                <span className="text-[#9747FF]">AI-powered chatbot</span> tailored for wellness businesses.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[#9747FF]">•</span>
              <span>
                <span className="text-[#9747FF]">Seamless integration</span> with your existing website.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[#9747FF]">•</span>
              <span>
                <span className="text-[#9747FF]">24/7 customer support</span>.
              </span>
            </li>
          </ul>
        </div>

        <Button onClick={handleProceed} className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-black/90">
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}
