"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type FormData = {
  logo: string | null
  themeColor: string
  keywords: string[]
  questions: string[]
  email: string
}

type OnboardingContextType = {
  currentStep: number
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
}

const defaultFormData: FormData = {
  logo: null,
  themeColor: "#9751F2", // Default purple color
  keywords: [],
  questions: [],
  email: "",
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const router = useRouter()

  const totalSteps = 5

  const updateFormData = (data: Partial<FormData>) => {
    console.log('updateFormData called with:', data);
    if (!data || typeof data !== 'object') {
      console.error('updateFormData called with invalid data:', data);
      return;
    }
    setFormData((prev) => ({ ...(prev || defaultFormData), ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      const nextStepNumber = currentStep + 1
      setCurrentStep(nextStepNumber)
      router.push(`/onboarding/step-${nextStepNumber}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const prevStepNumber = currentStep - 1
      setCurrentStep(prevStepNumber)
      router.push(`/onboarding/step-${prevStepNumber}`)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
      router.push(`/onboarding/step-${step}`)
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        formData,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
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
