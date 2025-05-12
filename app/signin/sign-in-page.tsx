"use client"
import Image from "next/image"
import loginImage from '../assets/images/login.png';
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { businessApi } from "@/app/services/api"
import logo from '../assets/images/logo.png';

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const onboardingStep = localStorage.getItem("onboardingStep");
    if (onboardingStep && ["1","2","3","4"].includes(onboardingStep)) {
      router.replace(`/onboarding/step-${onboardingStep}`);
    }
  }, [router]);

  // Email and password validation
  const validate = () => {
    if (!email) return "Email is required"
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Enter a valid email address"
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?)";
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      const data = await businessApi.signin(email, password)
      if (data.token) localStorage.setItem("token", data.token)
      if (data.business?._id) localStorage.setItem("businessId", data.business._id)
      router.push("/dashboard")
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8FA]">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden min-h-[500px]">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 md:px-12">
          <div className="mb-10">
            <div className="mb-4">
              <Image src={logo} alt="WellnexAI Logo" width={100} height={200} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Sign In</h1>
            <p className="text-gray-500 text-base mb-2 text-center">Your Business. Your AI. Welcome back!</p>
          </div>
          <form className="space-y-4 mb-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6C3FF]"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              /> 
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D6C3FF] pr-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.014 6 9.75 6 1.772 0 3.487-.37 5.02-1.057M21.75 12c-.512-.888-1.18-1.747-1.98-2.577m-3.27-2.568A9.956 9.956 0 0 0 12 6c-3.736 0-7.667 2.39-9.75 6a10.477 10.477 0 0 0 1.73 3.777m3.27 2.568A9.956 9.956 0 0 0 12 18c3.736 0 7.667-2.39 9.75-6a10.477 10.477 0 0 0-1.73-3.777m-3.27-2.568A9.956 9.956 0 0 0 12 6c-3.736 0-7.667 2.39-9.75 6a10.477 10.477 0 0 0 1.73 3.777" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M4.98 4.98A10.477 10.477 0 0 0 2.25 12c2.083 3.61 6.014 6 9.75 6 1.772 0 3.487-.37 5.02-1.057M21.75 12c-.512-.888-1.18-1.747-1.98-2.577m-3.27-2.568A9.956 9.956 0 0 0 12 6c-3.736 0-7.667 2.39-9.75 6a10.477 10.477 0 0 0 1.73 3.777m3.27 2.568A9.956 9.956 0 0 0 12 18c3.736 0 7.667-2.39 9.75-6a10.477 10.477 0 0 0-1.73-3.777" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 bg-[#D6C3FF] hover:bg-[#bba3e6] text-black font-medium rounded-md transition-colors disabled:opacity-60 mt-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <div className="flex flex-col items-center mt-2">
            <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm mb-2 underline">
              Forgot your password?
            </Link>
            <div className="text-sm text-gray-700">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-gray-900 font-medium underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        {/* Right: Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#F8F8FA]">
          <div className="relative w-full h-full min-h-[400px] min-w-[300px] max-w-[500px] rounded-r-2xl overflow-hidden shadow-lg flex items-center justify-center">
            <Image
              src={loginImage}
              alt="WellnexAI illustration"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
