"use client"

import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { businessApi } from "@/app/services/api"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Suspense } from "react"

interface Service {
  name: string;
  _id: string;
}

interface ApiResponse {
  code: number;
  status: boolean;
  message: string;
  data: {
    services: Service[];
  };
}

interface ServicesGridProps {
  onKeywordsChange?: (hasData: boolean) => void;
}

const ServicesGrid = forwardRef((props: ServicesGridProps, ref) => {
  const { formData, updateFormData } = useOnboarding()
  const servicesFromContext = Array.isArray(formData.services) ? formData.services : [];
  const [services, setServices] = useState<string[]>(
    servicesFromContext.length > 0
      ? [...servicesFromContext.filter((s) => s.trim() !== ""), ...Array(9 - servicesFromContext.filter((s) => s.trim() !== "").length).fill("")]
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
    const uniqueServices = Array.from(new Set(servicesFromContext.filter((s) => s.trim() !== "")))
    setServices([...uniqueServices, ...Array(9 - uniqueServices.length).fill("")])
  }, [formData.services])

  // On mount, load services from localStorage if available
  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      try {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed)) {
          const newServices = [...parsed.filter((s) => s.trim() !== ""), ...Array(9 - parsed.filter((s) => s.trim() !== "").length).fill("")];
          setServices(newServices);
          updateFormData({ services: parsed });
          props.onKeywordsChange?.(parsed.length > 0);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    // eslint-disable-next-line
  }, []);

  // Save services to localStorage whenever they change
  useEffect(() => {
    if (services && Array.isArray(services)) {
      const filtered = services.filter((s) => s.trim() !== "");
      localStorage.setItem('services', JSON.stringify(filtered));
    }
  }, [services]);

  // Handle Next button click
  const handleNext = async () => {
    // Filter out empty and duplicate services
    const filteredServices = Array.from(new Set(services.filter((s) => s.trim() !== "")))
    if (filteredServices.length === 0) {
      setError("Please enter at least one service")
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
      const response = await businessApi.updateOneService(
        filteredServices.map(name => ({ name })),
        token,
        businessId
      ) as ApiResponse
      // Update the services state with the returned data
      if (response.data?.services) {
        const newServices = response.data.services.map((s: Service) => s.name)
        updateFormData({ services: Array.from(new Set(newServices.filter((s) => s.trim() !== ""))) })
      } else {
        updateFormData({ services: filteredServices })
      }
      // Set onboarding step to 4 and navigate
      localStorage.setItem("onboardingStep", "4")
      router.push('/onboarding/services-provided')
    } catch (error) {
      console.error("Error saving services:", error)
      setError("Failed to save services. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newServices = [...services]
    newServices[index] = value
    setServices(newServices)
    setError(null) // Clear error when user makes changes
    // Check if there are any non-empty services
    const hasData = newServices.some(s => s.trim() !== "")
    props.onKeywordsChange?.(hasData)
  }

  // Handle key press (for Enter key navigation)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      // Focus the next input if available
      const nextIndex = index + 1
      if (nextIndex < 9) {
        const nextInput = document.getElementById(`service-${nextIndex}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <Suspense>
    <div className="space-y-6">
      <div>
        <Label htmlFor="service-0">Services</Label>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Input
              key={index}
              id={`service-${index}`}
              value={services[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder={index === 0 ? "Enter service" : ""}
              className="w-full"
              disabled={isSubmitting}
            />
          ))}
        </div>
      </div>

      <div className="rounded-md border p-4 text-sm">
        <p className="font-medium">Example</p>
        <p className="mt-2">
          Enter the services your business offers. These help your chatbot understand what services you provide and suggest
          the most relevant options to your customers. For example: Facial Treatment, Massage Therapy, Hair Styling,
          Manicure, Pedicure, etc.
        </p>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </div>
    </Suspense>
  )
});

export default ServicesGrid;
