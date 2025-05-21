"use client"

import { useState } from "react"
import { useOnboarding } from "../onboarding-context"
import { Button } from "@/components/ui/button"
import { businessApi } from "@/app/services/api"
import Lottie from "lottie-react";
import robotAnimation from "../../../public/robot.json";



export default function WelcomeScreen() {
  const { formData } = useOnboarding()
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle")

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendStatus("idle")

    try {
      const token = localStorage.getItem("token")
      const businessId = localStorage.getItem("businessId")
      
      if (!token || !businessId) {
        throw new Error("Missing token or businessId")
      }

      // Call sendVerificationEmail API
      const response = await businessApi.sendVerificationEmail(token, businessId)
      console.log("Verification email response:", response)
      
      setResendStatus("success")
    } catch (error) {
      console.error("Error sending verification email:", error)
      setResendStatus("error")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
<div className="w-36">
  <Lottie animationData={robotAnimation} loop={true} />
</div>

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
