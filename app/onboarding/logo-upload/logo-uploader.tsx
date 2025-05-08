"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

export default function LogoUploader() {
  const [logo, setLogo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)

    if (!file) return

    // Check if file is PNG
    if (!file.type.includes("png")) {
      setError("Please upload a PNG file only")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setLogo(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <p className="text-center text-sm font-medium">Upload Company Logo (.png formate only)</p>

      <div className="flex flex-col items-center">
        <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-100">
          {logo ? (
            <Image src={logo || "/placeholder.svg"} alt="Uploaded logo" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <input type="file" accept=".png" id="logo-upload" className="hidden" onChange={handleFileChange} />
        <label htmlFor="logo-upload">
          <Button variant="outline" className="cursor-pointer" asChild>
            <span>Upload Logo</span>
          </Button>
        </label>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}
