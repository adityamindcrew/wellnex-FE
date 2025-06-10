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

interface ServicesGridProps {
  onKeywordsChange?: (hasData: boolean) => void;
}

const ServicesGrid = forwardRef((props: ServicesGridProps, ref) => {
  const { formData, updateFormData } = useOnboarding()
  const [services, setServices] = useState<string[]>(new Array(9).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useImperativeHandle(ref, () => ({
    handleNext,
  }));

  // Handle Next button click
  const handleNext = async () => {
    const filledServices = services.filter(s => s.trim() !== "");
    
    if (filledServices.length === 0) {
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

      // Get existing services from localStorage
      const savedServices = localStorage.getItem('services');
      let existingServices: { name: string }[] = [];
      if (savedServices) {
        try {
          existingServices = JSON.parse(savedServices);
        } catch (e) {
          console.error("Error parsing saved services:", e);
        }
      }

      // Filter out services that already exist
      const newServices = filledServices
        .map(name => ({ name }))
        .filter(service => !existingServices.some(existing => existing.name === service.name));

      // If no new services, just move to next page
      if (newServices.length === 0) {
        router.push('/onboarding/step-5')
        return;
      }

      const response = await fetch('https://wellnexai.com/api/business/addBusinessServices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId,
          services: newServices
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save services');
      }

      const data = await response.json();
      
      // Save all services (existing + new) to localStorage
      if (data.data?.services) {
        const allServices = [...existingServices, ...newServices];
        localStorage.setItem('services', JSON.stringify(allServices));
      }

      router.push('/onboarding/step-5')
    } catch (error) {
      console.error("Error saving services:", error)
      setError("Failed to save services. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
    setError(null);
    props.onKeywordsChange?.(newServices.some(s => s.trim() !== ""));
  }

  // Load initial data
  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      try {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const newServices = new Array(9).fill("");
          parsed.forEach((service: { name: string }, index: number) => {
            if (index < 9) {
              newServices[index] = service.name;
            }
          });
          setServices(newServices);
          props.onKeywordsChange?.(true);
        }
      } catch (e) {
        localStorage.removeItem('services');
      }
    }
  }, []);

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
