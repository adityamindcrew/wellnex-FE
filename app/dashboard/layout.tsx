"use client"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import { Menu } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
        
        // Clear all storage
        localStorage.clear()
        sessionStorage.clear()
        
        // Clear all cookies with proper path and domain
        const cookies = document.cookie.split(";")
        cookies.forEach(cookie => {
          const [name] = cookie.split("=")
          document.cookie = `${name.trim()}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`
        })
        
        // Clear specific important cookies
        const cookiesToDelete = [
          'onboardingToken',
          'token',
          'authorization',
          'adminDashboardLock',
          'dashboardLock',
          'adminToken',
          'adminAuthorization',
          'currentStep',
          'inOnboarding',
          'userRole',
          'userData',
          'sessionId',
          'refreshToken'
        ]
        
        cookiesToDelete.forEach(cookieName => {
          document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`
        })

        // Clear any remaining data
        if (window.caches) {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name)
            })
          })
        }

        // Force reload to clear any remaining state
        window.location.href = '/signin'
      }
    }

    verifyToken()
  }, [router])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden bg-white p-2 rounded-md shadow-md"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
