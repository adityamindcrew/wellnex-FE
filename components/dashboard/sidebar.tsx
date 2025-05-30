import Link from "next/link"
import { Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import Image from "next/image"
import logo from "../../app/assets/images/logo.png"

export default function Sidebar() {
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem("token")
    console.log("Token:", token)
    try {
      await fetch(`https://wellnexai.com/api/business/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
    } catch (err) {
      // Optionally handle error
    }
    
    // Clear all localStorage items
    localStorage.clear();
    
    // Clear all cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Force a page reload to ensure all state is cleared
    window.location.href = "/signin"
  }, [router])

  return (
    <div className="flex w-[250px] md:w-[193px] flex-col border-r border-gray-200 bg-white h-full">
      <div className="flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center">
          <Image src={logo} alt="WellnexAI Logo" width={150} height={200} />
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
