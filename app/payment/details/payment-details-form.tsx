"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"

export default function PaymentDetailsForm() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      router.push("/payment/confirmation")
    }, 1500)
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center space-y-6">
        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Payment</h1>
            <p className="mt-2 text-sm text-gray-600">
              Complete your subscription by providing your payment information.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-48 w-72">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400 via-purple-600 to-indigo-600 p-1">
                <div className="absolute left-4 top-4">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 16H30M13 22H19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect x="1" y="1" width="38" height="38" rx="7" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white">
                    <div className="text-xs opacity-80">Card Number</div>
                    <div className="font-mono text-lg tracking-wider">•••• •••• •••• 1234</div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="text-white">
                      <div className="text-xs opacity-80">Expiry</div>
                      <div className="text-sm">06/25</div>
                    </div>
                    <div className="text-white">
                      <div className="text-xs opacity-80">CVC</div>
                      <div className="text-sm">•••</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-md bg-purple-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Subtotal</span>
                <span>$199.00</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm text-gray-500">Tax</span>
                <span>$0.00</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="font-medium">Total</span>
                <span className="font-bold">$199.00</span>
              </div>
            </div>

            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  placeholder="MM/YY"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  placeholder="123"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name on Card
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full rounded-md bg-black py-3 text-center text-white transition-colors hover:bg-black/90"
          >
            {isProcessing ? (
              "Processing..."
            ) : (
              <>
                <Lock className="mr-2 inline-block h-4 w-4" />
                Complete Payment
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Your payment information is secure and encrypted. You can cancel anytime.
          </p>
        </form>
      </div>
    </div>
  )
}
