"use client"

import { useState } from "react"
import { useOnboarding } from "../onboarding-context"
import { Button } from "@/components/ui/button"

export default function WelcomeScreen() {
  const { formData } = useOnboarding()
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle")

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendStatus("idle")

    try {
      // Simulate API call to resend verification email
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setResendStatus("success")
    } catch (error) {
      setResendStatus("error")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      <p className="text-center text-lg">
        Your account is almost ready. Please verify your email to unlock your dashboard and start building your AI
        chatbot.
      </p>

      <Button onClick={handleResendEmail} disabled={isResending} className="bg-[#987CF1] hover:bg-[#987CF1] px-8">
        {isResending ? "Sending..." : "Resend Email"}
      </Button>

      {resendStatus === "success" && <p className="text-sm text-green-600">Verification email has been resent!</p>}

      {resendStatus === "error" && <p className="text-sm text-red-600">Failed to resend email. Please try again.</p>}
    </div>
  )
}
