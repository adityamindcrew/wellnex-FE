"use client"

import { ChevronLeft, ChevronRight, Edit2 } from "lucide-react"
import Image from "next/image"

export default function ProfileScreen() {
  const profileItems = [
    { label: "Name", value: "Lara Ochoa" },
    { label: "Email", value: "Add email adress" },
    { label: "Contact number", value: "+1 7965812345" },
    { label: "Bank details", value: "Paypal, Apple Pay & Cards" },
    { label: "Title", value: "Photographer" },
    { label: "Based in", value: "San Francisco, CA" },
    { label: "My Schedule", value: "From 24th Nov, 2024 in Dubai, UAE" },
    { label: "Gear list", value: "View details" },
    { label: "Portfolio", value: "View portfolio" },
  ]

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4">
        <div className="text-black font-medium">9:41</div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-4 relative">
            <div className="absolute inset-0 flex items-end justify-around">
              <div className="w-1 h-1/3 bg-black rounded-sm"></div>
              <div className="w-1 h-2/3 bg-black rounded-sm"></div>
              <div className="w-1 h-full bg-black rounded-sm"></div>
              <div className="w-1 h-2/3 bg-black rounded-sm"></div>
            </div>
          </div>
          <div className="w-4 h-3 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 border-2 border-black rounded-full"></div>
              <div className="absolute top-0 right-0 w-1 h-1 bg-transparent border-t border-r border-black transform rotate-45"></div>
            </div>
          </div>
          <div className="w-6 h-3 bg-black rounded-sm relative">
            <div className="absolute right-0 top-0 h-3 w-1 bg-white transform translate-x-1/2 rounded-r-sm"></div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="px-4 py-2">
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Profile Picture */}
      <div className="flex justify-center my-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-blue-100">
            <Image
              src="/placeholder.svg?key=xzyy5"
              alt="Profile"
              width={112}
              height={112}
              className="object-cover w-full h-full"
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md">
            <Edit2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="mt-6">
        {profileItems.map((item, index) => (
          <div key={index}>
            <div className="px-6 py-3 flex justify-between items-center">
              <div>
                <div className="text-gray-500 text-sm mb-1">{item.label}</div>
                <div className="text-gray-900 text-lg">{item.value}</div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-px bg-gray-200 mx-6"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
