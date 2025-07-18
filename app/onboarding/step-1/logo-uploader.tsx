"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ImageIcon } from "lucide-react"
import { useOnboarding } from "../onboarding-context"
import { businessApi } from '../../services/api'
import { Suspense } from "react"

interface LogoUploaderProps {
  onFileSelect: (file: File | null) => void;
}

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Function to compress image
const compressImage = (file: File, maxSize: number = MAX_FILE_SIZE): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      const maxDimension = 800; // Maximum dimension
      
      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      // Convert to blob with compression
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/png',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, 'image/png', 0.8); // 80% quality
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export default function LogoUploader({ onFileSelect }: LogoUploaderProps) {
  const { formData, updateFormData } = useOnboarding()
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  const uploadLogo = async (file: File) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const businessId = typeof window !== 'undefined' ? localStorage.getItem('businessId') : null;
    
    if (!token || !businessId) {
      setError('No authentication token or business ID found. Please sign up or log in again.');
      return;
    }

    try {
      const data = await businessApi.uploadLogo(file, token, businessId);
      
      // Use the formatted URL from the API response
      if (data.logoUrl) {
        updateFormData({ logo: data.logoUrl });
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      if (err.message?.includes('413') || err.message?.includes('Request Entity Too Large')) {
        setError('File is too large. Please try a smaller image or contact support.');
      } else {
        setError(err.message || 'An error occurred while uploading the logo.');
      }
      throw err;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (!file) return

    // Check if file is PNG
    if (!file.type.includes("png")) {
      setError("Please upload a PNG file only")
      return
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
      return
    }

    try {
      setIsCompressing(true);
      
      // Compress the image if it's larger than 1MB
      let processedFile = file;
      if (file.size > 1024 * 1024) { // 1MB
        processedFile = await compressImage(file);
      }

      // Create preview URL and store in local storage
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setPreviewUrl(base64String)
        if (typeof window !== 'undefined') {
          localStorage.setItem('logoPreview', base64String)
        }
        onFileSelect(processedFile)
      }
      reader.readAsDataURL(processedFile)
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  }

  // Load preview from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreview = localStorage.getItem('logoPreview')
      if (savedPreview) {
        setPreviewUrl(savedPreview)
        // Convert base64 to File object
        fetch(savedPreview)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'logo.png', { type: 'image/png' })
            onFileSelect(file)
          })
          .catch(err => {
            console.error('Error converting base64 to file:', err)
          })
      }
    }
  }, [onFileSelect])

  return (
    <Suspense>
    <div className="w-full space-y-4 font-[DM_Sans]">
      <p className="text-center font-[DM_Sans] text-sm font-medium">
        Upload Company Logo (.png format only)
      </p>

      <div className="flex flex-col items-center">
        <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-100">
          {(previewUrl || formData.logo) ? (
            <Image 
              src={previewUrl || formData.logo || "/placeholder.svg"} 
              alt="Uploaded logo" 
              fill 
              className="object-cover" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <input type="file" accept=".png" id="logo-upload" className="hidden" onChange={handleFileChange} />
        <label htmlFor="logo-upload">
          <Button 
            className="cursor-pointer bg-[#987CF1] text-white border-none hover:bg-[#987CF1] hover:text-white focus:bg-[#987CF1] focus:text-white active:bg-[#987CF1] active:text-white" 
            asChild
            disabled={isCompressing}
          >
            <span>{isCompressing ? 'Processing...' : 'Upload Logo'}</span>
          </Button>
        </label>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
    </Suspense>
  )
}

// Export the upload function
LogoUploader.uploadLogo = async (file: File) => {
  const token = localStorage.getItem('token');
  const businessId = localStorage.getItem('businessId');
  
  if (!token || !businessId) {
    throw new Error('No authentication token or business ID found');
  }

  const data = await businessApi.uploadLogo(file, token, businessId);
  return data.logoUrl;
};
