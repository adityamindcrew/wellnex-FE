"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "../onboarding-context"
import LogoutButton from "@/components/ui/logout-button"

const steps = [
  "/onboarding/step-1",
  "/onboarding/step-2",
  "/onboarding/step-3",
  "/onboarding/step-4",
  "/onboarding/step-5"
];

interface FormCardProps {
  title: string
  description: string
  children: React.ReactNode
  showCancel?: boolean
  showNext?: boolean
  showBack?: boolean
  nextLabel?: string
  nextDisabled?: boolean
  onNext?: () => void
  hasData?: boolean
}

export default function FormCard({
  title,
  description,
  children,
  showCancel = true,
  showNext = true,
  showBack = false,
  nextLabel = "Next",
  nextDisabled = false,
  onNext,
  hasData = false,
}: FormCardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const totalSteps = steps.length;
  const currentStepIndex = steps.findIndex((step) => pathname.startsWith(step));

  const handleNext = async () => {
    try {
      // First execute any data saving logic and wait for it to complete
      if (onNext) {
        await onNext();
        // Only navigate if onNext completes successfully
        const nextStepIndex = currentStepIndex + 1;
        if (nextStepIndex < steps.length) {
          router.replace(steps[nextStepIndex]);
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
      // Don't navigate if there's an error
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      router.replace(steps[currentStepIndex - 1]);
    }
  };

  const getCurrentStepNumber = () => currentStepIndex + 1;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-6 px-4 py-8 relative">
          <div className="absolute right-4 top-4">
            <LogoutButton />
          </div>
          <div className="space-y-2 text-center mt-6">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>

          <div className="w-full">{children}</div>

          {(showNext || showCancel || showBack) && (
            <div className="flex w-full items-center justify-between pt-8">
              <div className="text-sm text-muted-foreground">Step {getCurrentStepNumber()}/{totalSteps}</div>
              <div className="flex space-x-2">
                {showCancel && (
                  <Button variant="outline" onClick={() => {
                    if (typeof window !== "undefined") {
                      window.history.back()
                    }
                  }}>
                    Cancel
                  </Button>
                )}
                {showBack && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {showNext && (
                  <Button 
                    onClick={() => handleNext()} 
                    disabled={nextDisabled || !hasData} 
                    className="bg-[#987CF1] hover:bg-[#987CF1]"
                  >
                    {nextLabel}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
