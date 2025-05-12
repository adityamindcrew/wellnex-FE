"use client"

import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { businessApi } from "@/app/services/api"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Keyword {
  name: string;
  _id: string;
}

interface ApiResponse {
  code: number;
  status: boolean;
  message: string;
  data: {
    keywords: Keyword[];
  };
}

const KeywordsGrid = forwardRef((props, ref) => {
  const { formData, updateFormData } = useOnboarding()
  const [keywords, setKeywords] = useState<string[]>(formData.keywords || Array(9).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // useEffect(() => {
  //   const onboardingStep = localStorage.getItem("onboardingStep");
  //   if (onboardingStep === "5") {
  //     router.replace("/onboarding/step-5");
  //   } else {
  //     localStorage.setItem("onboardingStep", "3");
  //   }
  // }, [router]);

  useImperativeHandle(ref, () => ({
    handleNext,
  }));

  // Handle Next button click
  const handleNext = async () => {
    // Filter out empty keywords
    const filteredKeywords = keywords.filter((keyword) => keyword.trim() !== "")
    
    if (filteredKeywords.length === 0) {
      toast({
        title: "Warning",
        description: "Please enter at least one keyword",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const businessId = localStorage.getItem("businessId")
      if (!token || !businessId) {
        throw new Error("Token or Business ID not found")
      }

      const response = await businessApi.addBusinessKeywords(
        filteredKeywords.map(name => ({ name })),
        token,
        businessId
      ) as ApiResponse

      // Update the keywords state with the returned data
      if (response.data?.keywords) {
        const newKeywords = response.data.keywords.map((k: Keyword) => k.name)
        setKeywords(newKeywords)
        updateFormData({ keywords: newKeywords })
      }

      toast({
        title: "Success",
        description: "Keywords saved successfully",
      })
      // Navigate to next step
      router.push('/onboarding/step-4')
    } catch (error) {
      console.error("Error saving keywords:", error)
      toast({
        title: "Error",
        description: "Failed to save keywords. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
              disabled={isSubmitting}
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
});

export default KeywordsGrid;
