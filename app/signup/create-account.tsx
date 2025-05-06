"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Info } from "lucide-react"
import loginImage from '../assets/images/login.png';

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    businessEmail: "",
    websiteUrl: "",
    instagram: "",
    contactName: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4 md:p-8 items-stretch">
        <div className="w-full md:w-1/2 pr-0 md:pr-8">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="h-6 w-6 mr-2">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="#000" />
                  <path d="M12 6L18 12L12 18L6 12L12 6Z" fill="white" />
                </svg>
              </div>
              <span className="text-sm font-medium">WellnexAI</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600 mb-6">Lorem ipsum dolor sit amet adipiscing elit.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <input
                type="email"
                name="businessEmail"
                placeholder="Business Email"
                value={formData.businessEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Info className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <input
                type="url"
                name="websiteUrl"
                placeholder="Website URL"
                value={formData.websiteUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                name="instagram"
                placeholder="Instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <input
                type="text"
                name="contactName"
                placeholder="Contact Name"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4">
              <hr className="border-gray-200 mb-6" />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-medium rounded-md transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        <div className="w-full md:w-[50%] flex items-stretch justify-center">
          <div className="relative w-full max-w-[500px] h-full rounded-lg overflow-hidden">
            <Image
              src={loginImage}
              alt="WellnexAI illustration"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
