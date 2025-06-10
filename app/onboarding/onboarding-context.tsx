"use client"

import React, { createContext, useContext, useState } from "react"
import { useRouter } from "next/navigation"

interface OnboardingFormData {
  keywords?: string[]
  services?: string[]
  questions?: string[]
  [key: string]: any
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

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    const nextStepNumber = currentStep + 1
    setCurrentStep(nextStepNumber)
    router.push(`/onboarding/step-${nextStepNumber}`)
  }

  const prevStep = () => {
    const prevStepNumber = currentStep - 1
    setCurrentStep(prevStepNumber)
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
        setIsVerified
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
