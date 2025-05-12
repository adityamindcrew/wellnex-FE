"use client"
import { useRef } from "react";
import FormCard from "../components/form-card"
import KeywordsGrid from "./keywords-grid"

export default function ChatbotUnderstandingPage() {
  const keywordsGridRef = useRef<{ handleNext: () => void }>(null);
  return (
    <FormCard title="Help Your Chatbot Understand Customers." description="" showBack={true} onNext={() => keywordsGridRef.current?.handleNext()}>
      <KeywordsGrid ref={keywordsGridRef} />
    </FormCard>
  )
}
