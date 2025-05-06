import FormCard from "../components/form-card"
import LogoUploader from "./logo-uploader"

export default function LogoUploadPage() {
  return (
    <FormCard
      title="Now, let's upload your logo."
      description="Your logo will appear on your AI chatbot to match your brand and create a trusted experience for your customers."
    >
      <LogoUploader />
    </FormCard>
  )
}
