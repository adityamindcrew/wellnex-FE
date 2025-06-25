"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { businessApi } from "@/app/services/api"

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

export default function ServicesInput() {
  const { formData, updateFormData } = useOnboarding()
  const servicesFromContext = Array.isArray(formData.services) ? formData.services : [];
  const [services, setServices] = useState<string[]>([]);
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load services from localStorage on component mount
  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      try {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed)) {
          const uniqueServices = Array.from(new Set(parsed.filter((s) => s.trim() !== "")));
          setServices([...uniqueServices, ...Array(9 - uniqueServices.length).fill("")]);
          updateFormData({ services: uniqueServices });
          if (uniqueServices.length > 0) {
            onKeywordsChange?.(true);
          }
          return;
        }
      } catch (e) {
        console.error("Error parsing saved services:", e);
      }
    }
    // If no localStorage, use context
    const contextServices = Array.isArray(formData.services) ? formData.services : [];
    const uniqueContextServices = Array.from(new Set(contextServices.filter((s) => s.trim() !== "")));
    setServices([...uniqueContextServices, ...Array(9 - uniqueContextServices.length).fill("")]);
    if (uniqueContextServices.length > 0) {
      onKeywordsChange?.(true);
    }
    // eslint-disable-next-line
  }, []);

  // Save services to localStorage whenever they change
  useEffect(() => {
    if (services && Array.isArray(services)) {
      const filtered = services.filter((s) => s.trim() !== "");
      localStorage.setItem('services', JSON.stringify(filtered));
      // Notify parent about data change
      onKeywordsChange?.(filtered.length > 0);
    }
  }, [services]);

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
    // Update form data with non-empty services
    const filtered = newServices.filter(s => s.trim() !== "");
    updateFormData({ services: filtered });
    // Notify parent about data change
    onKeywordsChange?.(filtered.length > 0);
  }

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

      const response = await fetch(`http://13.61.105.209/api/business/addBusinessServices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId,
          services: filteredServices.map(name => ({ name }))
        })
      });
   

      if (!response.ok) {
        throw new Error('Failed to save services');
      }

      const data = await response.json();
      
      // Update the services state with the returned data
      if (data.data?.services) {
        const newServices = data.data.services.map((s: Service) => s.name)
        updateFormData({ services: Array.from(new Set(newServices.filter((s: string) => s.trim() !== ""))) })
      } else {
        updateFormData({ services: filteredServices })
      }
      
      // Navigate to step 5
      localStorage.setItem("onboardingStep", "5");
      router.push('/onboarding/step-5')
    } catch (error) {
      console.error("Error saving services:", error)
      setError("Failed to save services. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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

      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          disabled={isSubmitting || services.filter(s => s.trim() !== "").length === 0}
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting || services.filter(s => s.trim() !== "").length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  )
}
