import FormCard from "../components/form-card"
import ColorPicker from "./color-picker"

export default function ThemeColorPage() {
  return (
    <FormCard
      title="Choose Your Color"
      description="This will set the visual appearance of your chatbot to match your website and brand."
      showBack={true}
    >
      <ColorPicker />
    </FormCard>
  )
}
