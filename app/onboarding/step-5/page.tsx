"use client"

import { useRef, useState, useEffect } from "react";
import FormCard from "../components/form-card"
import QuestionsInput from "./questions-input"

export default function ChatbotQuestionsPage() {
  const questionsInputRef = useRef<{ handleSave: () => void }>(null);
  const [hasQuestions, setHasQuestions] = useState(false);

  // Check for existing questions in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuestions = localStorage.getItem('questions');
      if (savedQuestions) {
        try {
          const parsed = JSON.parse(savedQuestions);
          if (Array.isArray(parsed) && parsed.some(q => q.trim() !== "")) {
            setHasQuestions(true);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  return (
    <FormCard
      title="Customize the Questions Your Chatbot Will Ask/Reply"
      description="These questions will be shown to your customers during their AI consultation. Their answers will be matched with your keywords to recommend the most relevant services or products."
      showBack={true}
      onNext={() => questionsInputRef.current?.handleSave()}
      hasData={hasQuestions}
    >
      <QuestionsInput ref={questionsInputRef} onQuestionsChange={(hasData) => setHasQuestions(hasData)} />
    </FormCard>
  )
}
