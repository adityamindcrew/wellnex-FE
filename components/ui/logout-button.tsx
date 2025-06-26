"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // First, call the server logout endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear all cookies
      const cookies = document.cookie.split(";")
      cookies.forEach(cookie => {
        const [name] = cookie.split("=")
        document.cookie = `${name.trim()}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      })

      // Force a complete page reload to signin
      window.location.href = '/signin'
    } catch (err) {
      console.error("Logout error:", err)
      // Even if the server call fails, try to clear everything locally
      localStorage.clear()
      sessionStorage.clear()
      document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.split("=")
        document.cookie = `${name.trim()}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      })
      window.location.href = '/signin'
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-600 hover:text-gray-900 underline"
    >
      Logout
    </button>
  );
} 