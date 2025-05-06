"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "../onboarding-context"

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
}: FormCardProps) {
  const { currentStep, nextStep, prevStep } = useOnboarding()

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else {
      nextStep()
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-6 px-4 py-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>

          <div className="w-full">{children}</div>

          {(showNext || showCancel || showBack) && (
            <div className="flex w-full items-center justify-between pt-8">
              <div className="text-sm text-muted-foreground">Step {currentStep}/5</div>
              <div className="flex space-x-2">
                {showCancel && (
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                )}
                {showBack && (
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                )}
                {showNext && (
                  <Button onClick={handleNext} disabled={nextDisabled} className="bg-purple-500 hover:bg-purple-600">
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
