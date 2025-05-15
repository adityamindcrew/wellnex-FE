"use client"

import React, { useImperativeHandle, forwardRef, useState, useEffect, useRef } from "react"
import { useOnboarding } from "../onboarding-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PipetteIcon, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { businessApi } from '../../services/api'
import { useRouter } from 'next/navigation';
import { Suspense } from "react"
const ColorPicker = forwardRef((props, ref) => {
  const router = useRouter();
  const { formData, updateFormData } = useOnboarding()
  const [selectedColor, setSelectedColor] = useState("")
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // RGB values
  const [r, setR] = useState(0)
  const [g, setG] = useState(0)
  const [b, setB] = useState(0)

  // Refs for the color areas
  const gradientRef = useRef<HTMLDivElement>(null)
  const hueSliderRef = useRef<HTMLDivElement>(null)

  // Position of the selector in the gradient
  const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 })
  const [huePos, setHuePos] = useState(0)

  // Toggle color picker
  const togglePicker = () => {
    setIsPickerOpen(!isPickerOpen)
  }

  // Update RGB and HEX when color changes
  useEffect(() => {
    if (!selectedColor) return;

    // Convert hex to rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 }
    }

    const rgb = hexToRgb(selectedColor)
    setR(rgb.r)
    setG(rgb.g)
    setB(rgb.b)

    // Only update context, do not call API here
    if (formData.themeColor !== selectedColor) {
      updateFormData({ themeColor: selectedColor })
    }
  }, [selectedColor, updateFormData, formData.themeColor])

  // Handle manual hex input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`
    if (value.match(/^#([0-9A-F]{3}){1,2}$/i) || value === "#") {
      setSelectedColor(value)
      setError(null)
    }
  }

  // Handle RGB input changes
  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const clampedValue = Math.max(0, Math.min(255, numValue))

    if (component === "r") setR(clampedValue)
    if (component === "g") setG(clampedValue)
    if (component === "b") setB(clampedValue)

    // Update hex color
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    setSelectedColor(hex)
    setError(null)
  }

  // Handle click on the gradient
  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return

    const rect = gradientRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setGradientPos({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    })

    // Calculate color based on position and current hue
    updateColorFromPositions(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)), huePos)
    setError(null)
  }

  // Handle click on the hue slider
  const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueSliderRef.current) return

    const rect = hueSliderRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width

    setHuePos(Math.max(0, Math.min(1, x)))

    // Update color based on new hue and current gradient position
    updateColorFromPositions(gradientPos.x, gradientPos.y, Math.max(0, Math.min(1, x)))
    setError(null)
  }

  // Calculate color from positions
  const updateColorFromPositions = (gradX: number, gradY: number, huePosition: number) => {
    // Convert hue position to hue value (0-360)
    const hue = huePosition * 360

    // Calculate saturation and lightness from gradient position
    const saturation = gradX * 100
    const lightness = (1 - gradY) * 50 // Adjust for better visual match

    // Convert HSL to RGB
    const rgbColor = hslToRgb(hue, saturation, lightness)
    setR(rgbColor.r)
    setG(rgbColor.g)
    setB(rgbColor.b)

    // Convert RGB to hex
    const hex = `#${rgbColor.r.toString(16).padStart(2, "0")}${rgbColor.g.toString(16).padStart(2, "0")}${rgbColor.b.toString(16).padStart(2, "0")}`
    setSelectedColor(hex)
  }

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Call API only in handleSetThemeColor, not in useEffect or on color change
  const handleSetThemeColor = async () => {
    if (!selectedColor) {
      setError("Please select a color before proceeding");
      return;
    }

    const token = localStorage.getItem('token')
    const businessId = localStorage.getItem('businessId')
    if (!token || !businessId) {
      setError('No authentication token or business ID found. Please sign up or log in again.')
      return
    }
    try {
      await businessApi.setThemeColor(selectedColor, token, businessId)
      setError(null)
      router.push('/onboarding/step-3')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set theme color')
    }
  }

  useImperativeHandle(ref, () => ({
    handleSetThemeColor,
  }));

  return (
    <Suspense>
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="theme-color">Select The Theme</Label>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 shrink-0 rounded-md border" style={{ backgroundColor: selectedColor || '#ffffff' }} />
          <Input id="theme-color" type="text" value={selectedColor} onChange={handleHexChange} className="flex-1" placeholder="#000000" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={togglePicker}
            className="h-10 w-10 shrink-0"
            aria-label={isPickerOpen ? "Close color picker" : "Open color picker"}
          >
            {isPickerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {/* Color Picker - only shown when isPickerOpen is true */}
      {isPickerOpen && (
        <div className="relative mt-4 rounded-md border p-4">
          {/* Main color gradient */}
          <div
            ref={gradientRef}
            className="relative h-64 w-full cursor-pointer rounded-md"
            style={{
              background: `linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(0,0,0,1) 100%), 
                          linear-gradient(to right, rgba(128,128,128,1) 0%, hsl(${huePos * 360}, 100%, 50%) 100%)`,
              backgroundBlendMode: "multiply",
            }}
            onClick={handleGradientClick}
          >
            {/* Selector circle */}
            <div
              className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
              style={{
                left: `${gradientPos.x * 100}%`,
                top: `${gradientPos.y * 100}%`,
                backgroundColor: selectedColor || '#ffffff',
              }}
            />
          </div>

          {/* Color picker tools */}
          <div className="mt-4 flex items-center gap-2">
            {/* Eyedropper tool */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-600 text-white"
              aria-label="Color picker tool"
            >
              <PipetteIcon className="h-5 w-5" />
            </button>

            {/* Hue slider */}
            <div
              ref={hueSliderRef}
              className="relative h-10 flex-1 cursor-pointer rounded-md"
              style={{
                background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
              }}
              onClick={handleHueClick}
            >
              {/* Hue selector */}
              <div
                className="absolute top-0 h-full w-1 -translate-x-1/2 border-2 border-white"
                style={{ left: `${huePos * 100}%` }}
              />
            </div>
          </div>

          {/* RGB inputs */}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 text-center">
              <div className="text-xs font-medium">HEX</div>
              <Input value={selectedColor.replace("#", "")} onChange={handleHexChange} className="mt-1 text-center" placeholder="000000" />
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs font-medium">R</div>
              <Input
                type="number"
                min="0"
                max="255"
                value={r}
                onChange={(e) => handleRgbChange("r", e.target.value)}
                className="mt-1 text-center"
              />
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs font-medium">G</div>
              <Input
                type="number"
                min="0"
                max="255"
                value={g}
                onChange={(e) => handleRgbChange("g", e.target.value)}
                className="mt-1 text-center"
              />
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs font-medium">B</div>
              <Input
                type="number"
                min="0"
                max="255"
                value={b}
                onChange={(e) => handleRgbChange("b", e.target.value)}
                className="mt-1 text-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </Suspense>
  )
});

export default ColorPicker;
