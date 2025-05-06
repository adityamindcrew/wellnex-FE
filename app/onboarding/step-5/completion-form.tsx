"use client"

import type React from "react"

import { useState } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CompletionForm() {
  const { formData, updateFormData } = useOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="your@email.com"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting || !formData.email}>
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="rounded-md border p-4 text-sm">
        <p>Your account includes:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Customized AI chatbot</li>
          <li>Customer insights dashboard</li>
          <li>Integration with your website</li>
          <li>24/7 customer support</li>
        </ul>
      </div>
    </form>
  )
}
