"use client"
import { Search, Menu } from "lucide-react"
import { useState } from "react"
import { useDashboardSearch } from "./layout";

interface HeaderProps {
  onHamburgerClick?: () => void;
}

export default function Header({ onHamburgerClick }: HeaderProps) {
  const { searchTerm, setSearchTerm, isLoading } = useDashboardSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white pr-4 md:pr-6">
      <div className="relative w-full max-w-[450px] ml-0 md:ml-12 ml-0 lg:ml-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className={`h-5 w-5 ${isLoading ? 'animate-pulse text-gray-500' : 'text-gray-400'}`} />
        </div>
        <input
          type="text"
          placeholder="Search businesses..."
          value={searchTerm}
          onChange={handleSearch}
          disabled={isLoading}
          className={`w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-gray-400 focus:outline-none ${
            isLoading ? 'bg-gray-50' : ''
          }`}
        />
      </div>
      {/* Hamburger menu on the right for mobile */}
      <button
        className="md:hidden ml-2 p-2 rounded-md bg-black text-white shadow-lg"
        onClick={onHamburgerClick}
        aria-label="Open sidebar menu"
      >
        <Menu size={24} />
      </button>
      {/* <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:block text-right">
          <div className="text-sm font-medium">Jon Smith</div>
          <div className="text-xs text-gray-500">Sr. Doctor</div>
        </div>
        <div className="h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full bg-gray-200">
          <img src="/avatar.png" alt="Jon Smith" className="h-full w-full object-cover" />
        </div>
      </div> */}
    </header>
  )
}
