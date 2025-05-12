"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ImageIcon } from "lucide-react"
import { useOnboarding } from "../onboarding-context"
import { businessApi } from '../../services/api'
import { useRouter } from 'next/navigation';

export default function LogoUploader() {
  const router = useRouter();
  const { formData, updateFormData } = useOnboarding()
  const [error, setError] = useState<string | null>(null)

  // useEffect(() => {
  //   const onboardingStep = localStorage.getItem("onboardingStep");
  //   if (onboardingStep === "5") {
  //     router.replace("/onboarding/step-5");
  //   } else {
  //     localStorage.setItem("onboardingStep", "1");
  //   }
  // }, [router]);

  const uploadLogo = async (file: File) => {
    const token = localStorage.getItem('token');
    const businessId = localStorage.getItem('businessId');
    console.log('kdvdfghghthtcccc',businessId);
    
    if (!token || !businessId) {
      setError('No authentication token or business ID found. Please sign up or log in again.');
      return;
    }
    try {
      const data = await businessApi.uploadLogo(file, token, businessId);
      // Construct full URL if needed
      let logoUrl = '';
      if (data.logoUrl) {
        logoUrl = data.logoUrl.startsWith('http')
          ? data.logoUrl
          : `http://56.228.66.97:3000/${data.logoUrl.replace(/^\//, '')}`;
      }
      updateFormData({ logo: logoUrl });
      router.push('/onboarding/step-2');

    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading the logo.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (!file) return

    // Check if file is PNG
    if (!file.type.includes("png")) {
      setError("Please upload a PNG file only")
      return
    }

    uploadLogo(file);
  }

  return (
    <div className="w-full space-y-4 font-[DM_Sans]">
      <p className="text-center font-[DM_Sans] text-sm font-medium">Upload Company Logo (.png format only)</p>

      <div className="flex flex-col items-center">
        <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-100">
          {formData.logo ? (
            <Image src={formData.logo || "/placeholder.svg"} alt="Uploaded logo" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <input type="file" accept=".png" id="logo-upload" className="hidden" onChange={handleFileChange} />
        <label htmlFor="logo-upload">
          <Button variant="outline" className="cursor-pointer bg-[#987CF1] text-white border-none hover:bg-[#7a63c7]" asChild>
            <span>Upload Logo</span>
          </Button>
        </label>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}
