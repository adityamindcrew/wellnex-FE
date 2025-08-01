"use client"

import type React from "react"
import { useState, useEffect, useImperativeHandle, forwardRef, Suspense } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { businessApi } from "@/app/services/api"
import { useRouter } from "next/navigation"

interface QuestionsInputProps {
  onQuestionsChange?: (hasData: boolean) => void;
}

const QuestionsInputInner = forwardRef((props: QuestionsInputProps, ref) => {
  const { formData, updateFormData } = useOnboarding()
  const [questions, setQuestions] = useState<string[]>(formData.questions || Array(5).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useImperativeHandle(ref, () => ({
    handleSave,
  }));

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
    const filteredQuestions = questions.filter((question) => question.trim() !== "");
  
    // Only update if the value actually changed
    if (
      !formData.questions ||
      filteredQuestions.length !== (formData.questions?.length ?? 0) ||
      filteredQuestions.some((q, i) => q !== (formData.questions?.[i] ?? ""))
    ) {
      updateFormData({ questions: filteredQuestions });
    }
  
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("questions", JSON.stringify(questions));
    }
  }, [questions, formData.questions, updateFormData]);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedQuestions = localStorage.getItem("questions");
      if (storedQuestions) {
        try {
          const parsed = JSON.parse(storedQuestions);
          if (Array.isArray(parsed)) {
            setQuestions(parsed);
            // Check if there are any non-empty questions
            const hasData = parsed.some(q => q.trim() !== "")
            props.onQuestionsChange?.(hasData)
          }
        } catch (e) {
          console.error("Failed to parse questions from localStorage:", e);
        }
      }
    }
  }, [props.onQuestionsChange]);
  

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
    setError(null) // Clear error when user makes changes
    // Check if there are any non-empty questions
    const hasData = newQuestions.some(q => q.trim() !== "")
    props.onQuestionsChange?.(hasData)
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
    // Check if at least one question is entered
    const filteredQuestions = questions.filter(q => q.trim() !== "");
    if (filteredQuestions.length === 0) {
      setError("Please enter at least one question");
      return;
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const businessId = typeof window !== 'undefined' ? localStorage.getItem("businessId") : null;
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      
      if (!businessId) {
        setError("Business ID not found. Please try again.");
        return;
      }
      if (!token) {
        setError("Authentication token not found. Please try again.");
        return;
      }

      // Format questions, keywords and services as objects with name property
      const formattedQuestions = filteredQuestions.map(q => ({ name: q }));

      const keywords = (formData.keywords || [])
        .map((k: any) => ({ name: typeof k === 'string' ? k : k.name || "" }));

      const services = Array.isArray((formData as any).services) 
        ? (formData as any).services.map((s: any) => ({ name: typeof s === 'string' ? s : s.name || "" }))
        : [];

      // First call SetupChatbot
  
      const setupResponse = await businessApi.setupChatbot(
        businessId,
        formattedQuestions,
        token
      );
   

      // After successful setup, send verification email
   
      const verificationResponse = await businessApi.sendVerificationEmail(token, businessId)
     

      router.push("/onboarding/step-6");
    } catch (err: any) {
      setError(err.message || "Failed to save questions. Please try again.");
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
            disabled={isSubmitting}
          />
        ))}
      </div>

      <div className="rounded-md border p-4 text-sm">
        <p className="font-medium">Example</p>
        <p className="mt-2">What's your main skin concern? What kind of treatment are you looking for?</p>
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </div>
  )
});

const QuestionsInput = (props: QuestionsInputProps, ref: any) => (
  <Suspense>
    <QuestionsInputInner {...props} ref={ref} />
  </Suspense>
);

export default forwardRef(QuestionsInput);
