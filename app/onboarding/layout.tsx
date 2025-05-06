import type React from "react"
import { OnboardingProvider } from "./onboarding-context"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <OnboardingProvider>{children}</OnboardingProvider>
    </div>
  )
}
