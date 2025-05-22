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
      <div className="flex flex-col i space-y-6">
        <div className="text-[#9747FF]">
          <CreditCard/>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#181D27]">WellnexAI Pro Subscription</h1>
          <p className="text-sm text-[#535862]">
          Secure your AI chatbot in just one step - your subscription begins today.
          </p>
        </div>

        <div className="w-full rounded-md bg-[#F4EEFF] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[#7F56D9]"><span className="text-[#53389E]">Plan</span> $199/month
            </span>
            <Check className="h-5 w-5 text-[#9747FF]" />
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2 text-[#7F56D9]">•</span>
              
                <span className="text-[#7F56D9]">AI-powered chatbot tailored for wellness businesses.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[#7F56D9]">•</span>
            
                <span className="text-[#7F56D9]">Seamless integration with your existing website.
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-[#7F56D9]">•</span>

                <span className="text-[#7F56D9]">24/7 customer support</span>.
             
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
