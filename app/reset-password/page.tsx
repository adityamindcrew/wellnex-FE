"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { businessApi } from "../services/api"
import logo from '../assets/images/logo.png'
import { Eye, EyeOff } from "lucide-react"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const token = searchParams.get("token")
    if (!token) {
      setError("Invalid or missing reset token")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const token = searchParams.get("token")
    if (!token) {
      setError("Invalid or missing reset token")
      setIsLoading(false)
      return
    }

    try {
      await businessApi.resetPassword(email, password, token)
      setSuccess(true)
      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (err: any) {
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
          <h1 className="text-3xl font-bold mb-2 text-center">Reset Password</h1>
          <p className="text-gray-500 text-base mb-2 text-center">
            Enter your email and new password.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            Password has been reset successfully. Redirecting to sign in...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-[#F5F0FF] border border-[#000000] text-[#000000] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="w-full py-2 px-4 text-gray-600 hover:text-gray-800"
          >
            Back to Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
} 