"use client"

import type React from "react"

import { useState } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export default function KeywordsInput() {
  const { formData, updateFormData } = useOnboarding()
  const [inputValue, setInputValue] = useState("")

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const newKeywords = [...formData.keywords, inputValue.trim()]
      updateFormData({ keywords: newKeywords })
      setInputValue("")
    }
  }

  const removeKeyword = (index: number) => {
    const newKeywords = [...formData.keywords]
    newKeywords.splice(index, 1)
    updateFormData({ keywords: newKeywords })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          placeholder="Type a keyword and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={addKeyword}
          className="mt-1"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {formData.keywords.map((keyword, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1">
            {keyword}
            <button onClick={() => removeKeyword(index)} className="ml-2 rounded-full" aria-label={`Remove ${keyword}`}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="rounded-md border p-4">
        <h3 className="text-sm font-medium">Example</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          If your business might use words when describing their concerns or questions, these help your chatbot
          understand the needs and suggest the most relevant solutions.
        </p>
        <p className="mt-2 text-xs">
          For example: If you run a wellness center, you might add keywords like "appointment", "massage", "therapy",
          "booking", "cancel", "reschedule", etc.
        </p>
      </div>
    </div>
  )
}
