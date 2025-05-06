"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function KeywordsGrid() {
  const { formData, updateFormData } = useOnboarding()
  const [keywords, setKeywords] = useState<string[]>(formData.keywords || Array(9).fill(""))

  // Update form data when keywords change
  useEffect(() => {
    // Filter out empty keywords
    const filteredKeywords = keywords.filter((keyword) => keyword.trim() !== "")
    updateFormData({ keywords: filteredKeywords })
  }, [keywords, updateFormData])

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  // Handle key press (for Enter key navigation)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      // Focus the next input if available
      const nextIndex = index + 1
      if (nextIndex < 9) {
        const nextInput = document.getElementById(`keyword-${nextIndex}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="keyword-0">Keywords</Label>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Input
              key={index}
              id={`keyword-${index}`}
              value={keywords[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder={index === 0 ? "Enter keyword" : ""}
              className="w-full"
            />
          ))}
        </div>
      </div>

      <div className="rounded-md border p-4 text-sm">
        <p className="font-medium">Example</p>
        <p className="mt-2">
          Enter keywords your customers might use when describing their concerns or interests. These help your chatbot
          understand their needs and suggest the most relevant service or product. For example: acne, wrinkles, stress,
          hair laser, massage, dark circle, vitamins, hair loss, facial.
        </p>
      </div>
    </div>
  )
}
