"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard } from "lucide-react"

type PaymentMethod = {
  id: string
  type: "visa" | "mastercard" | "applepay"
  lastFour: string
  expiry: string
}

export default function PaymentMethodSelection() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string>("mastercard-1234")

  const paymentMethods: PaymentMethod[] = [
    {
      id: "visa-1234",
      type: "visa",
      lastFour: "1234",
      expiry: "06/2025",
    },
    {
      id: "mastercard-1234",
      type: "mastercard",
      lastFour: "1234",
      expiry: "06/2032",
    },
    {
      id: "applepay-1234",
      type: "applepay",
      lastFour: "1234",
      expiry: "06/2025",
    },
  ]

  const handleProceed = () => {
    router.push("/payment/details")
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <div className="flex flex-col items-center space-y-6">
        {/* Credit Card Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <CreditCard className="h-8 w-8 text-purple-600" />
        </div>

        {/* Heading and Subheading */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Almost There! Choose How You'd like to Pay.</h1>
          <p className="text-sm text-gray-600">All transactions are encrypted and processed securely.</p>
        </div>

        {/* Payment Methods */}
        <div className="w-full space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                selectedMethod === method.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {method.type === "visa" && (
                    <div className="h-8 w-12">
                      <svg viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-12">
                        <path d="M17.4401 15.7501H13.7701L16.0001 0.25H19.6701L17.4401 15.7501Z" fill="#00579F" />
                        <path
                          d="M32.7801 0.5801C32.1301 0.3301 31.1001 0.0801 29.8401 0.0801C26.0001 0.0801 23.3401 2.1001 23.3201 4.9501C23.3001 7.0301 25.2201 8.1901 26.6601 8.9101C28.1401 9.6401 28.6201 10.1201 28.6201 10.7701C28.6001 11.7701 27.3801 12.2301 26.2401 12.2301C24.6601 12.2301 23.8201 12.0301 22.4401 11.5301L21.9401 11.3101L21.4001 14.6701C22.1801 15.0001 23.6401 15.3001 25.1601 15.3201C29.2401 15.3201 31.8401 13.3301 31.8601 10.2901C31.8801 8.6301 30.8801 7.3701 28.6801 6.3301C27.3401 5.6701 26.5601 5.2301 26.5601 4.5301C26.5801 3.9101 27.2601 3.2701 28.7401 3.2701C29.9801 3.2501 30.8801 3.5301 31.5801 3.8101L31.9401 3.9701L32.7801 0.5801Z"
                          fill="#00579F"
                        />
                        <path
                          d="M37.5399 10.5701C37.9399 9.5501 39.3599 5.7901 39.3599 5.7901C39.3399 5.8101 39.7399 4.7701 39.9599 4.1301L40.2599 5.6301C40.2599 5.6301 41.0799 9.7301 41.2599 10.5701C40.6199 10.5701 38.3599 10.5701 37.5399 10.5701ZM43.1599 0.2501H40.3199C39.3799 0.2501 38.6799 0.5301 38.2599 1.4701L32.6399 15.7501H36.7199C36.7199 15.7501 37.4599 13.7301 37.6199 13.2901C38.0799 13.2901 41.7599 13.2901 42.3399 13.2901C42.4599 13.8701 42.8599 15.7501 42.8599 15.7501H46.4999L43.1599 0.2501Z"
                          fill="#00579F"
                        />
                        <path
                          d="M12.2201 0.2501L8.38007 10.8301L8.02007 9.0501C7.38007 6.6501 5.20007 4.0501 2.78007 2.7301L6.28007 15.7301H10.4001L16.3001 0.2501H12.2201Z"
                          fill="#00579F"
                        />
                        <path
                          d="M5.62 0.25H0.0600001L0 0.5C4.34 1.63 7.22 4.52 8.02 8.05L6.86 1.47C6.66 0.53 6.2 0.27 5.62 0.25Z"
                          fill="#FAA61A"
                        />
                      </svg>
                    </div>
                  )}
                  {method.type === "mastercard" && (
                    <div className="h-8 w-12">
                      <svg viewBox="0 0 48 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-12">
                        <path d="M17.4 25.5H30.6V4.5H17.4V25.5Z" fill="#FF5F00" />
                        <path
                          d="M18.3 15C18.3 10.8 20.4 7.1 23.4 4.5C21 2.4 17.9 1.2 14.5 1.2C6.9 1.2 0.7 7.4 0.7 15C0.7 22.6 6.9 28.8 14.5 28.8C17.9 28.8 21 27.6 23.4 25.5C20.4 23 18.3 19.2 18.3 15Z"
                          fill="#EB001B"
                        />
                        <path
                          d="M47.3 15C47.3 22.6 41.1 28.8 33.5 28.8C30.1 28.8 27 27.6 24.6 25.5C27.7 22.9 29.7 19.2 29.7 15C29.7 10.8 27.6 7.1 24.6 4.5C27 2.4 30.1 1.2 33.5 1.2C41.1 1.2 47.3 7.5 47.3 15Z"
                          fill="#F79E1B"
                        />
                      </svg>
                    </div>
                  )}
                  {method.type === "applepay" && (
                    <div className="h-8 w-12">
                      <svg viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-12">
                        <path
                          d="M8.6 3.9C9.1 3.3 9.4 2.5 9.3 1.7C8.5 1.7 7.6 2.2 7.1 2.8C6.6 3.3 6.2 4.2 6.3 4.9C7.2 5 8.1 4.5 8.6 3.9Z"
                          fill="black"
                        />
                        <path
                          d="M9.3 5C8 4.9 6.9 5.7 6.3 5.7C5.7 5.7 4.7 5 3.7 5C2.3 5 0.8 6.1 0 7.8C-0.7 9.5 -0.2 12.8 0.5 14.7C0.9 15.6 1.4 16.6 2.1 16.6C2.8 16.6 3.1 16.1 4 16.1C4.9 16.1 5.2 16.6 5.9 16.6C6.6 16.6 7.1 15.7 7.5 14.8C8 13.8 8.2 12.8 8.2 12.7C8.2 12.7 6.9 12.2 6.9 10.6C6.9 9.2 7.9 8.6 8 8.5C7.4 7.6 6.4 7.5 6.1 7.5C5.3 7.5 4.6 8 4.2 8C3.8 8 3.2 7.5 2.5 7.5C1.9 7.5 1.3 7.8 0.9 8.3C1.3 7.1 2.4 5.1 4.4 5.1C5.4 5.1 6.2 5.6 6.8 5.6C7.4 5.6 8.3 5 9.3 5Z"
                          fill="black"
                        />
                        <path
                          d="M16.3 16.5H14.8L14 14.1H11.1L10.3 16.5H8.9L11.8 8.2H13.4L16.3 16.5ZM13.7 13L13 11C12.9 10.8 12.7 10.1 12.5 9.1H12.5C12.4 9.6 12.2 10.3 12 11L11.3 13H13.7Z"
                          fill="black"
                        />
                        <path
                          d="M23.5 13.2C23.5 14.3 23.2 15.2 22.5 15.8C21.9 16.3 21.2 16.6 20.4 16.6C19.5 16.6 18.8 16.3 18.4 15.7H18.4V19.1H17V11.8C17 11.2 17 10.5 16.9 9.8H18.1L18.2 10.8H18.2C18.7 10 19.5 9.6 20.5 9.6C21.3 9.6 22 9.9 22.5 10.5C23.2 11.2 23.5 12.1 23.5 13.2ZM22.1 13.3C22.1 12.6 21.9 12 21.6 11.5C21.3 11 20.8 10.8 20.2 10.8C19.8 10.8 19.4 10.9 19.1 11.2C18.8 11.4 18.6 11.8 18.5 12.2C18.4 12.4 18.4 12.5 18.4 12.6V14.1C18.4 14.6 18.6 15 18.8 15.3C19.1 15.6 19.5 15.8 19.9 15.8C20.6 15.8 21.1 15.5 21.4 15C21.9 14.5 22.1 13.9 22.1 13.3Z"
                          fill="black"
                        />
                        <path
                          d="M30.7 13.2C30.7 14.3 30.4 15.2 29.7 15.8C29.1 16.3 28.4 16.6 27.6 16.6C26.7 16.6 26 16.3 25.6 15.7H25.6V19.1H24.2V11.8C24.2 11.2 24.2 10.5 24.1 9.8H25.3L25.4 10.8H25.4C25.9 10 26.7 9.6 27.7 9.6C28.5 9.6 29.2 9.9 29.7 10.5C30.4 11.2 30.7 12.1 30.7 13.2ZM29.3 13.3C29.3 12.6 29.1 12 28.8 11.5C28.5 11 28 10.8 27.4 10.8C27 10.8 26.6 10.9 26.3 11.2C26 11.4 25.8 11.8 25.7 12.2C25.6 12.4 25.6 12.5 25.6 12.6V14.1C25.6 14.6 25.8 15 26 15.3C26.3 15.6 26.7 15.8 27.1 15.8C27.8 15.8 28.3 15.5 28.6 15C29.1 14.5 29.3 13.9 29.3 13.3Z"
                          fill="black"
                        />
                        <path
                          d="M38.2 14C38.2 14.8 37.9 15.5 37.3 16C36.6 16.6 35.7 16.9 34.5 16.9C33.4 16.9 32.5 16.7 31.8 16.2L32.2 15C32.9 15.5 33.7 15.7 34.6 15.7C35.3 15.7 35.8 15.5 36.2 15.2C36.6 14.9 36.8 14.5 36.8 14C36.8 13.6 36.6 13.2 36.3 13C36 12.7 35.5 12.5 34.8 12.3C33.3 11.8 32.5 11 32.5 9.9C32.5 9.1 32.8 8.5 33.4 8C34 7.5 34.8 7.2 35.8 7.2C36.7 7.2 37.5 7.4 38.1 7.7L37.7 8.9C37.1 8.6 36.5 8.4 35.7 8.4C35.1 8.4 34.6 8.6 34.3 8.8C34 9.1 33.8 9.4 33.8 9.8C33.8 10.2 34 10.5 34.3 10.8C34.6 11 35.1 11.3 35.9 11.5C36.8 11.8 37.5 12.1 37.9 12.5C38.1 12.9 38.2 13.4 38.2 14Z"
                          fill="black"
                        />
                        <path
                          d="M42.1 10.9H40.5V14.3C40.5 15.1 40.8 15.5 41.3 15.5C41.6 15.5 41.8 15.5 42 15.4L42.1 16.5C41.8 16.6 41.4 16.7 41 16.7C40.5 16.7 40.1 16.5 39.8 16.2C39.5 15.9 39.3 15.3 39.3 14.5V10.9H38.3V9.8H39.3V8.5L40.6 8.1V9.8H42.1V10.9Z"
                          fill="black"
                        />
                        <path
                          d="M48.1 13.2C48.1 14.2 47.8 15.1 47.2 15.7C46.5 16.4 45.7 16.7 44.7 16.7C43.7 16.7 42.9 16.4 42.3 15.8C41.7 15.2 41.4 14.4 41.4 13.3C41.4 12.3 41.7 11.4 42.3 10.8C42.9 10.1 43.7 9.8 44.7 9.8C45.7 9.8 46.5 10.1 47.1 10.7C47.8 11.3 48.1 12.2 48.1 13.2ZM46.7 13.3C46.7 12.6 46.5 12 46.2 11.5C45.9 11 45.4 10.7 44.7 10.7C44 10.7 43.5 11 43.2 11.5C42.9 12 42.7 12.6 42.7 13.3C42.7 14 42.9 14.6 43.2 15.1C43.5 15.6 44 15.9 44.7 15.9C45.4 15.9 45.9 15.6 46.2 15.1C46.5 14.5 46.7 13.9 46.7 13.3Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {method.type === "visa" && "Visa"}
                      {method.type === "mastercard" && "Mastercard"}
                      {method.type === "applepay" && "Apple Pay"}
                      {" ending in "}
                      {method.lastFour}
                    </div>
                    <div className="text-sm text-gray-500">Expiry {method.expiry}</div>
                  </div>
                </div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                  {selectedMethod === method.id && <div className="h-3 w-3 rounded-full bg-purple-600"></div>}
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Set as default</span>
                <span className="text-purple-600 hover:underline cursor-pointer">Edit</span>
              </div>
            </div>
          ))}
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="w-full rounded-md bg-black py-3 text-center text-white transition-colors hover:bg-black/90"
        >
          Proceed to Enter Payment Details
        </button>
      </div>
    </div>
  )
}
