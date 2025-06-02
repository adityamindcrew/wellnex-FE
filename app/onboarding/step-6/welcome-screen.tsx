"use client"

import { useState, useEffect } from "react"
import { useOnboarding } from "../onboarding-context"
import { Button } from "@/components/ui/button"
import { businessApi } from "@/app/services/api"
import Lottie from "lottie-react";
import robotAnimation from "../../../public/robot.json";
import { useRouter } from "next/navigation";

export default function WelcomeScreen() {
  const { formData } = useOnboarding()
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [hasResendClicked, setHasResendClicked] = useState(false)
  const [hasCheckClicked, setHasCheckClicked] = useState(false)
  const router = useRouter()

  // Reset states when component mounts
  useEffect(() => {
    setHasResendClicked(false)
    setHasCheckClicked(false)
    setResendStatus("idle")
    setStatusMessage("")
  }, [])

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendStatus("idle")
    setHasResendClicked(true)

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
      // Reset the clicked state after 5 seconds
      setTimeout(() => {
        setHasResendClicked(false)
      }, 100)
    } catch (error) {
      console.error("Error sending verification email:", error)
      setResendStatus("error")
      // Reset the clicked state after 5 seconds
      setTimeout(() => {
        setHasResendClicked(false)
      }, 100)
    } finally {
      setIsResending(false)
    }
  }

  const handleCheckVerification = async () => {
    setIsChecking(true)
    setHasCheckClicked(true)
    try {
      const token = localStorage.getItem("token")
      const businessId = localStorage.getItem("businessId")
      
      if (!token || !businessId) {
        throw new Error("Missing token or businessId")
      }

      const response = await fetch("https://wellnexai.com/api/business/checkEmailVerified", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      const data = await response.json()
      
      if (data.data?.isEmailVerified === true) {
        // Set tokens in both localStorage and cookies
        localStorage.setItem('token', token)
        document.cookie = `token=${token}; path=/`
        document.cookie = `authorization=Bearer ${token}; path=/`
        
        router.push('/payment/currencySelection')
      } else {
        setResendStatus("error")
        setStatusMessage("Please check your email and click the link to verify your account!!!")
        // Reset the clicked state after 5 seconds
        setTimeout(() => {
          setHasCheckClicked(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Error checking email verification:", error)
      setResendStatus("error")
      // Reset the clicked state after 5 seconds
      setTimeout(() => {
        setHasCheckClicked(false)
      }, 5000)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      <div className="w-64 h-48 mb-0 flex items-center justify-center mt-2">
        <Lottie animationData={robotAnimation} loop={true} style={{marginBottom: 0}} />
      </div>

      <p className="text-center text-lg">
        Your account is almost ready. Please verify your email to unlock your dashboard and start building your AI
        chatbot.
      </p>

      <div className="flex flex-row space-x-4">
        <Button 
          onClick={handleResendEmail} 
          disabled={isResending} 
          className="bg-[#987CF1] hover:bg-[#987CF1] w-30"
        >
          {isResending ? "Sending..." : "Resend Email"}
        </Button>

        <Button 
          onClick={handleCheckVerification} 
          disabled={isChecking} 
          className="bg-[#987CF1] hover:bg-[#987CF1] w-30"
        >
          {isChecking ? "Checking..." : "Next"}
        </Button>
      </div>

      {resendStatus === "success" && <p className="text-sm text-green-600">Verification email has been resent!</p>}

      {resendStatus === "error" && <p className="text-sm text-red-600">{statusMessage || "Failed to resend email. Please try again."}</p>}

      {/* <a href="#" className="text-sm text-[#987CF1] underline hover:text-[#7F56D9]">
        Need help: Installing your chatbot?
      </a> */}
    </div>
  )
}
