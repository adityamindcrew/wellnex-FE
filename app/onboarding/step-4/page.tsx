"use client"

import { useRef } from "react";
import FormCard from "../components/form-card"
import QuestionsInput from "./questions-input"

export default function ChatbotQuestionsPage() {
  const questionsInputRef = useRef<{ handleSave: () => void }>(null);
  return (
    <FormCard
      title="Customize the Questions Your Chatbot Will Ask/Reply"
      description="These questions will be shown to your customers during their AI consultation. Their answers will be matched with your keywords to recommend the most relevant services or products."
      showBack={true}
      onNext={() => questionsInputRef.current?.handleSave()}
    >
      <QuestionsInput ref={questionsInputRef} />
    </FormCard>
  )
}
