"use client"

import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { businessApi } from "@/app/services/api"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Suspense } from "react"

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

interface KeywordsGridProps {
  onKeywordsChange?: (hasData: boolean) => void;
}

const KeywordsGrid = forwardRef((props: KeywordsGridProps, ref) => {
  const { formData, updateFormData } = useOnboarding()
  const keywordsFromContext = Array.isArray(formData.keywords) ? formData.keywords : [];
  const [keywords, setKeywords] = useState<string[]>(
    keywordsFromContext.length > 0
      ? [...keywordsFromContext.filter((k) => k.trim() !== ""), ...Array(9 - keywordsFromContext.filter((k) => k.trim() !== "").length).fill("")]
      : Array(9).fill("")
  );
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  useEffect(() => {
    const uniqueKeywords = Array.from(new Set(keywordsFromContext.filter((k) => k.trim() !== "")))
    setKeywords([...uniqueKeywords, ...Array(9 - uniqueKeywords.length).fill("")])
  }, [formData.keywords])

  // On mount, load keywords from localStorage if available
  useEffect(() => {
    const savedKeywords = localStorage.getItem('keywords');
    if (savedKeywords) {
      try {
        const parsed = JSON.parse(savedKeywords);
        if (Array.isArray(parsed)) {
          const newKeywords = [...parsed.filter((k) => k.trim() !== ""), ...Array(9 - parsed.filter((k) => k.trim() !== "").length).fill("")];
          setKeywords(newKeywords);
          updateFormData({ keywords: parsed });
          props.onKeywordsChange?.(parsed.length > 0);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    // eslint-disable-next-line
  }, []);

  // Save keywords to localStorage whenever they change
  useEffect(() => {
    if (keywords && Array.isArray(keywords)) {
      const filtered = keywords.filter((k) => k.trim() !== "");
      localStorage.setItem('keywords', JSON.stringify(filtered));
    }
  }, [keywords]);

  // Handle Next button click
  const handleNext = async () => {
    // Filter out empty and duplicate keywords
    const filteredKeywords = Array.from(new Set(keywords.filter((k) => k.trim() !== "")))
    if (filteredKeywords.length === 0) {
      setError("Please enter at least one keyword")
      return
    }
    try {
      setIsSubmitting(true)
      setError(null)
      const token = localStorage.getItem("token")
      const businessId = localStorage.getItem("businessId")
      if (!token || !businessId) {
        setError("Token or Business ID not found")
        return
      }
      const response = await businessApi.addBusinessKeywords(
        filteredKeywords.map(name => ({ name })),
        token,
        businessId
      ) as ApiResponse
      // Update the keywords state with the returned data
      if (response.data?.keywords) {
        const newKeywords = response.data.keywords.map((k: Keyword) => k.name)
        updateFormData({ keywords: Array.from(new Set(newKeywords.filter((k) => k.trim() !== ""))) })
      } else {
    updateFormData({ keywords: filteredKeywords })
      }
      // Navigate to next step
      router.push('/onboarding/step-4')
    } catch (error) {
      console.error("Error saving keywords:", error)
      setError("Failed to save keywords. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
    setError(null) // Clear error when user makes changes
    // Check if there are any non-empty keywords
    const hasData = newKeywords.some(k => k.trim() !== "")
    props.onKeywordsChange?.(hasData)
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
    <Suspense>
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

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </div>
    </Suspense>
  )
});

export default KeywordsGrid;
