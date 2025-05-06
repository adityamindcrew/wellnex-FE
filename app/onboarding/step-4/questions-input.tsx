"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"

export default function QuestionsInput() {
  const { formData, updateFormData } = useOnboarding()
  const [questions, setQuestions] = useState<string[]>(formData.questions || Array(5).fill(""))

  // Update form data when questions change
  useEffect(() => {
    // Filter out empty questions
    const filteredQuestions = questions.filter((question) => question.trim() !== "")
    updateFormData({ questions: filteredQuestions })
  }, [questions, updateFormData])

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  // Handle key press (for Enter key navigation)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      // Focus the next input if available
      const nextIndex = index + 1
      if (nextIndex < 5) {
        const nextInput = document.getElementById(`question-${nextIndex}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Input
            key={index}
            id={`question-${index}`}
            value={questions[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            placeholder={index === 0 ? "Enter a question your chatbot should ask" : ""}
            className="w-full"
          />
        ))}
      </div>

      <div className="rounded-md border p-4 text-sm">
        <p className="font-medium">Example</p>
        <p className="mt-2">What's your main skin concern? What kind of treatment are you looking for?</p>
      </div>
    </div>
  )
}
