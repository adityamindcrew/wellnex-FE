"use client"
import Image from "next/image"
import loginImage from '../assets/images/login.png';
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted")
    // Here you would handle login, not redirect to signup
  }
  return (
    <div className="flex min-h-screen bg-white flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-[30%] p-8 md:p-16 flex flex-col justify-center">
        <div className="mb-12">
          <div className="flex items-center">
            <div className="h-8 w-8 mr-2">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L21.5 7.5V16.5L12 22L2.5 16.5V7.5L12 2Z" stroke="black" strokeWidth="2" fill="white" />
                <path d="M12 6L18 9.5V16.5L12 20L6 16.5V9.5L12 6Z" fill="black" />
              </svg>
            </div>
            <span className="text-lg font-medium">WellnexAI</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Sign Up</h1>
          <p className="text-gray-700">Your Busines. Your AI. Welcome back!</p>
        </div>

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-medium rounded-md transition-colors"
          >
            Log in
          </button>
        </form>

        <div className="border-t border-gray-200 pt-6 mb-4 w-full"></div>

        <div className="text-center space-y-4">
          <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm">
            Forgot your password?
          </Link>
          <div className="text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-gray-900 font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[50%] flex items-center justify-center">
        <div className="relative w-full max-w-[500px] h-[350px] md:h-[400px] rounded-lg overflow-hidden shadow">
          <Image
            src={loginImage}
            alt="WellnexAI illustration"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  )
}
