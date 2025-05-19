"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
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