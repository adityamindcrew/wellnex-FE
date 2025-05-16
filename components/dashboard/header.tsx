import { Search } from "lucide-react"

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="relative w-full max-w-[450px] ml-12 md:ml-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-gray-400 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:block text-right">
          <div className="text-sm font-medium">Jon Smith</div>
          <div className="text-xs text-gray-500">Sr. Doctor</div>
        </div>
        <div className="h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full bg-gray-200">
          <img src="/avatar.png" alt="Jon Smith" className="h-full w-full object-cover" />
        </div>
      </div>
    </header>
  )
}
