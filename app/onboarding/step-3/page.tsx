"use client"
import { useRef, useState, useEffect } from "react";
import FormCard from "../components/form-card"
import KeywordsGrid from "./keywords-grid"

export default function ChatbotUnderstandingPage() {
  const keywordsGridRef = useRef<{ handleNext: () => void }>(null);
  const [hasKeywords, setHasKeywords] = useState(false);

  // Check for existing keywords in localStorage
  useEffect(() => {
    const savedKeywords = localStorage.getItem('keywords');
    if (savedKeywords) {
      try {
        const parsed = JSON.parse(savedKeywords);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasKeywords(true);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  return (
    <FormCard 
      title="Help Your Chatbot Understand Customers." 
      description="" 
      showBack={true} 
      onNext={() => keywordsGridRef.current?.handleNext()}
      hasData={hasKeywords}
    >
      <KeywordsGrid ref={keywordsGridRef} onKeywordsChange={(hasData) => setHasKeywords(hasData)} />
    </FormCard>
  )
}
