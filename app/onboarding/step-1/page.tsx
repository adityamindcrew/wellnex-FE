"use client"

import FormCard from "../components/form-card"
import LogoUploader from "./logo-uploader"
import { useOnboarding } from "../onboarding-context"
import { Suspense, useState, useEffect } from "react"

export default function LogoUploadPage() {
  const { nextStep, updateFormData } = useOnboarding()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check for existing logo in formData
  useEffect(() => {
    const savedLogo = localStorage.getItem('logoPreview')
    if (savedLogo) {
      // If we have a saved logo, we can proceed
      setSelectedFile(new File([], 'logo.png'))
    }
  }, [])

  const handleNext = async () => {
    if (!selectedFile) {
      setError("Please select a logo before proceeding");
      return;
    }
    try {
      setError(null);
      const logoUrl = await LogoUploader.uploadLogo(selectedFile);
      updateFormData({ logo: logoUrl });
      nextStep();
    } catch (error) {
      console.error('Error uploading logo:', error);
      setError("Failed to upload logo. Please try again.");
    }
  }

  return (
    <FormCard
      title="Now, let's upload your logo."
      description="Your logo will appear on your AI chatbot to match your brand and create a trusted experience for your customers."
      onNext={handleNext}
    >
      <LogoUploader onFileSelect={setSelectedFile} />
      {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}
    </FormCard>
  )
}
