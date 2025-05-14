"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white z-50 border-b border-gray-200 py-4">
          <div className="flex flex-col space-y-4 px-6">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              How
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Blog
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
