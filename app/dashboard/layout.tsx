"use client"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Check for token in localStorage and cookies
    const token = localStorage.getItem("token") || 
                 document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]

    if (!token) {
      console.log("No token found, redirecting to signin")
      router.replace("/signin")
      return
    }

    // Verify token is valid
    const verifyToken = async () => {
      try {
        // You can add an API call here to verify the token if needed
        console.log("Token verified")
      } catch (error) {
        console.error("Token verification failed:", error)
        // Clear invalid token
        localStorage.removeItem("token")
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        router.replace("/signin")
      }
    }

    verifyToken()
  }, [router])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}
