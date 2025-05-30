"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    localStorage.removeItem("token")
    localStorage.removeItem("businessId")
    localStorage.removeItem("onboardingStep")

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "onboardingToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // Then redirect to logout
    router.push("/logout");
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