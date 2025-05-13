"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Info, Eye, EyeOff } from "lucide-react"
import { businessApi } from "../services/api"
import logo from '../assets/images/logo.png'

export default function ForgotPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(token ? 2 : 1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(token)

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";
    }
    return null;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with email:", email)
    
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      console.log("Calling forgotPassword API...")
      const response = await businessApi.forgotPassword(email)
      console.log("API Response:", response)
      
      if (response.status) {
        setSuccess(true)
        setResetToken(response.data.resetPasswordToken)
        setStep(2)
      } else {
        throw new Error(response.message || "Failed to send reset password email")
      }
    } catch (err: any) {
      console.error("Error in forgot password:", err)
      setError(err.message || "Failed to send reset password email")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      console.log("Calling resetPassword API...")
      const response = await businessApi.resetPassword(email, password, resetToken || "")
      console.log("API Response:", response)
      
      if (response.status) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/signin")
        }, 2000)
      } else {
        throw new Error(response.message || "Failed to reset password")
      }
    } catch (err: any) {
      console.error("Error in reset password:", err)
      setError(err.message || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex justify-center items-center">
      <div className="w-full max-w-[400px] bg-white shadow-lg rounded-2xl p-8">
        <div className="mb-8">
          <div className="mb-4">
            <Image src={logo} alt="WellnexAI Logo" width={100} height={200} />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center">Forgot Password</h1>
          <p className="text-gray-500 text-base mb-2 text-center">
            {step === 1 
              ? "Enter your email address and we'll send you a link to reset your password."
              : "Enter your new password below."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {step === 1 
              ? "Reset password link has been sent to your email."
              : "Password has been reset successfully. Redirecting to login..."}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-[#F5F0FF] border border-[#000000] text-[#000000] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
            >
              {isLoading ? "Sending..." : "Next"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base mb-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-[#F5F0FF] border border-[#000000] text-[#000000] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={() => router.push("/signin")}
          className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 mt-4"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  )
} 