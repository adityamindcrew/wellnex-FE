import Link from "next/link"
import { Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export default function Sidebar() {
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem("token")
    console.log("Token:", token)
    try {
      await fetch(`http://56.228.66.97:3000/business/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
    } catch (err) {
      // Optionally handle error
    }
    // Clear localStorage and cookies
    localStorage.removeItem("token")
    localStorage.removeItem("businessId")
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/signin")
  }, [router])

  return (
    <div className="flex w-[193px] flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 0L26.1195 7V21L14 28L1.88053 21V7L14 0Z"
                fill="black"
                stroke="black"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-semibold">WellnexAI</span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col px-2 py-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-white hover:bg-gray-800"
        >
          <Home size={18} />
          <span>Dashboard</span>
        </Link>
      </div>
      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">
        Logout
      </button>
    </div>
  )
}
