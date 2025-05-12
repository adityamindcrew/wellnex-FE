"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { businessApi } from "@/app/services/api"
import { useRouter } from "next/navigation"

export default function QuestionsInput() {
  const { formData, updateFormData } = useOnboarding()
  const [questions, setQuestions] = useState<string[]>(formData.questions || Array(5).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // useEffect(() => {
  //   const onboardingStep = localStorage.getItem("onboardingStep")
  //   if (onboardingStep === "5") {
  //     router.replace("/onboarding/step-5")
  //   } else {
  //     localStorage.setItem("onboardingStep", "4")
  //   }
  // }, [router])

  // Update form data when questions change
  useEffect(() => {
    // Filter out empty questions
    const filteredQuestions = questions.filter((question) => question.trim() !== "")
    // Only update if the value actually changed
    if (
      !formData.questions ||
      filteredQuestions.length !== formData.questions.length ||
      filteredQuestions.some((q, i) => q !== formData.questions[i])
    ) {
      updateFormData({ questions: filteredQuestions })
    }
  }, [questions, formData.questions, updateFormData])

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

  const handleSave = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      const businessId = localStorage.getItem("businessId")
      if (!token || !businessId) throw new Error("Missing token or businessId")
      // Prepare keywords and services as string arrays if available in formData
      const keywords = (formData.keywords || []).map((k: any) => typeof k === 'string' ? k : k.name || "");
      const services = Array.isArray((formData as any).services) ? (formData as any).services.map((s: any) => typeof s === 'string' ? s : s.name || "") : [];
      await businessApi.setupChatbot(
        businessId,
        questions.filter(q => q.trim() !== ""),
        token,
        keywords,
        services
      );
      // Call email verification API after chatbot setup
      await businessApi.sendVerificationEmail(token, businessId);
      router.push("/onboarding/step-5");
    } catch (err: any) {
      setError(err.message || "Failed to save questions");
    } finally {
      setIsSubmitting(false);
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
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className="px-6 py-2 bg-[#987CF1] text-white rounded-lg font-semibold shadow hover:bg-[#7a63c7] transition-colors"
      >
        {isSubmitting ? "Saving..." : "Next"}
      </button>
    </div>
  )
}
