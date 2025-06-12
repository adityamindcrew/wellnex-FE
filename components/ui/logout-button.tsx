"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem("token")
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