"use client"
import { useRef, useState, useEffect } from "react";
import FormCard from "../components/form-card"
import ServicesGrid from "./servies-grid"
import { useRouter } from "next/navigation"

interface ServicesGridRef {
  handleNext: () => void;
}

export default function ServicesProvidedPage() {
  const servicesGridRef = useRef<ServicesGridRef>(null);
  const [hasServices, setHasServices] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedServices = localStorage.getItem('services');
    if (savedServices) {
      try {
        const parsed = JSON.parse(savedServices);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasServices(true);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  return (
    <FormCard 
      title="What Services Do You Offer?" 
      description="Let us know about the services your business provides." 
      showBack={true} 
      onNext={() => servicesGridRef.current?.handleNext()}
      hasData={hasServices}
    >
      <ServicesGrid ref={servicesGridRef} onKeywordsChange={(hasData: boolean) => setHasServices(hasData)} />
    </FormCard>
  )
}
