import Link from "next/link"
import { Home } from "lucide-react"

export default function Sidebar() {
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
    </div>
  )
}
