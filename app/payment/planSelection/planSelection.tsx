"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Check, Feather} from "lucide-react"
import feature from  "../../assets/images/Featured.png"
import Image from "next/image"
import check from "../../assets/images/checkbox.png"
import { useEffect, useState } from "react"

interface Plan {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  interval: string;
  features: string[];
  isPopular: boolean;
}

export default function PlanSelectionCard() {
  const router = useRouter()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const priceId = searchParams.get("priceId")

  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://wellnexai.com/api/subscription/plans', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription plan');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setPlan(data[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (plan) {
      localStorage.setItem("priceId", plan.id);
      localStorage.setItem("planAmount", plan.amount.toString());
      localStorage.setItem("planCurrency", plan.currency.toUpperCase());
      localStorage.setItem("planInterval", plan.interval);
      router.push("/payment/cardDetails");
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7F56D9]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    )
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
          <h1 className="text-xl text-[#181D27]">WellnexAI Pro Subscription</h1>
          <p className="text-[#535862]">Secure your AI chatbot in just one step - your subscription begins today.</p>
        </div>

        {/* Plan Details Box */}
        <div className="w-full rounded-lg bg-purple-50 p-4 border border-[#D6BBFB]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-purple-400 w-12 h-12 relative">
                <Image 
                  src={feature} 
                  alt="Digital background" 
                  className="object-contain"
                  fill
                />
              </div>
              <div className="font-medium">
                <span className="text-[#7F56D9] text-lg">
                  {plan ? `${plan.currency.toUpperCase()} ${plan.amount}/${plan.interval}` : '$29.99/month'}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 relative">
              <Image 
                src={check} 
                alt="Digital background" 
                className="object-contain"
                fill
              />
            </div>
          </div>
          <ul className="mt-3 pl-6">
                <li className="flex items-start">
                  <span className="mr-2 text-[#7F56D9]">•</span>
                  <div>
                    <span className="text-[#7F56D9]">AI-powered chatbot tailored for wellness businesses.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-[#7F56D9]">•</span>
                  <div>
                    <span className="text-[#7F56D9]">Seamless integration with your existing website.</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-[#7F56D9]">•</span>
                  <div>
                    <span className="text-[#7F56D9]">24/7 customer support.</span>
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

