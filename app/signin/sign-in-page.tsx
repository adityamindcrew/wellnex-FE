"use client"
import Image from "next/image"
import loginImage from '../assets/images/login.png';
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { businessApi } from "@/app/services/api"
import logo from '../assets/images/logo.png';
import { EyeOff, Eye } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const onboardingStep = localStorage.getItem("onboardingStep");
    if (onboardingStep && ["1", "2", "3", "4"].includes(onboardingStep)) {
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
      // Set loginToken as token and _id as businessId
      const token = data.data?.loginToken;
      const businessId = data.data?._id;
      const roles = data.data?.roles;

      if (token) {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; max-age=2592000`;
        document.cookie = `authorization=Bearer ${token}; path=/; max-age=2592000`;

        if (businessId) {
          localStorage.setItem("businessId", businessId);
        }

        // Check if user is admin and redirect accordingly
        if (roles && roles.includes('admin')) {
          window.location.href = "/admin/dashboard";
        } else {
          if (data.data?.nextStep.length > 0) {
            localStorage.setItem("nextStep", data.data?.nextStep);
            router.push(`/onboarding/${data.data?.nextStep}`);
          } else {
            if (!data.data.isEmailVerified) {
              router.push(`/onboarding/step-6`);
            }
            else if (!data.data.subscription) {
              router.push(`/payment/currencySelection`);
            }
            else {
              router.push(`/dashboard`);
            }
          }
        }
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8FA]">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden min-h-[500px]">
        {/* Image: show on all screens, on top for mobile, no rounded corners, margin top on mobile */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-[#F8F8FA] order-1 md:order-2 mt-6 md:mt-0">
          <div className="relative w-full h-40 md:h-full min-h-[200px] min-w-[200px] max-w-[500px] overflow-hidden shadow-lg flex items-center justify-center">
            <Image
              src={loginImage}
              alt="WellnexAI illustration"
              fill
              // className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        {/* Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 md:px-12 order-2 md:order-1">
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
                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[rgba(152,124,241,0.5)] border border-[#000000] text-[#000000] font-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <div className="flex flex-col items-center mt-2">
            <Link href="/forgot-password" className="text-gray-700 hover:text-gray-900 text-sm mb-2 underline">
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
      </div>
    </div>
  )
}
