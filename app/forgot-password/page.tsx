"use client"

import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { businessApi } from "../services/api"
import logo from '../assets/images/logo.png'

function ForgotPasswordContent() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPasswordReset, setIsPasswordReset] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
 
      const response = await businessApi.forgotPassword(email)
      

      if (response.status) {
        setSuccess(true)
        setEmail("")
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

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex justify-center items-center">
      <div className="w-full max-w-[400px] bg-white shadow-lg rounded-2xl p-8">
        <div className="mb-8">
          <div className="mb-4">
            <Image src={logo} alt="WellnexAI Logo" width={100} height={200} />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center">Forgot Password</h1>
          <p className="text-gray-500 text-base mb-2 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            Reset password link has been sent to your email.
          </div>
        )}

        {success && isPasswordReset && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            Password has been reset successfully. Redirecting to login...
          </div>
        )}
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
            className="w-full py-2 px-4 bg-[rgba(152,124,241,0.5)] border border-[#000000] text-[#000000] font-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
          >
            {isLoading ? "Sending..." : "Submit"}
          </button>
        </form>


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

export default function ForgotPassword() {
  return (
    <Suspense>
      <ForgotPasswordContent />
    </Suspense>
  )
} 