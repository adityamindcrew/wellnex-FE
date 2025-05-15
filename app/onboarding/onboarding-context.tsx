"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface OnboardingFormData {
  businessName?: string
  logo?: string
  themeColor?: string
  keywords?: string[]
  questions?: string[]
  services?: string[]
  isVerified?: boolean
}

interface OnboardingContextType {
  formData: OnboardingFormData
  updateFormData: (data: Partial<OnboardingFormData>) => void
  nextStep: () => void
  prevStep: () => void
  currentStep: number
  isVerified: boolean
  setIsVerified: (verified: boolean) => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingFormData>({})
  const [isVerified, setIsVerified] = useState(false)

  // Check verification status on mount
  useEffect(() => {
    const verified = localStorage.getItem('isVerified') === 'true'
    setIsVerified(verified)
  }, [])

  // Prevent access to other steps when on verification screen
  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboardingStep = localStorage.getItem("onboardingStep")
      if (onboardingStep === "5" && !isVerified) {
        // If on step 5 and not verified, prevent access to other steps
        const currentPath = window.location.pathname
        if (currentPath !== '/onboarding/step-5') {
          router.replace('/onboarding/step-5')
        }
      }
    }
  }, [isVerified, router])

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    const nextStepNumber = currentStep + 1
    setCurrentStep(nextStepNumber)
    localStorage.setItem("onboardingStep", nextStepNumber.toString())
    router.push(`/onboarding/step-${nextStepNumber}`)
  }

  const prevStep = () => {
    const prevStepNumber = currentStep - 1
    setCurrentStep(prevStepNumber)
    localStorage.setItem("onboardingStep", prevStepNumber.toString())
    router.push(`/onboarding/step-${prevStepNumber}`)
  }

  return (
    <OnboardingContext.Provider
      value={{
        formData,
        updateFormData,
        nextStep,
        prevStep,
        currentStep,
        isVerified,
        setIsVerified: (verified: boolean) => {
          setIsVerified(verified)
          localStorage.setItem('isVerified', verified.toString())
        }
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
