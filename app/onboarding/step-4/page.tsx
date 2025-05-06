import FormCard from "../components/form-card"
import QuestionsInput from "./questions-input"

export default function ChatbotQuestionsPage() {
  return (
    <FormCard
      title="Customize the Questions Your Chatbot Will Ask/Reply"
      description="These questions will be shown to your customers during their AI consultation. Their answers will be matched with your keywords to recommend the most relevant services or products."
      showBack={true}
    >
      <QuestionsInput />
    </FormCard>
  )
}
