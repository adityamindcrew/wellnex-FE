"use client"

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FormCard from "../components/form-card"
import ColorPicker from "./color-picker"

export default function OnboardingStep2() {
  const router = useRouter();
  const colorPickerRef = useRef<{ handleSetThemeColor: () => void }>(null);
  const [hasColor, setHasColor] = useState(false);

  // Check for existing color in localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
      setHasColor(true);
    }
  }, []);

  return (
    <FormCard
      title="Choose Your Color"
      description="This will set the visual appearance of your chatbot to match your website and brand."
      showBack={true}
      onNext={() => colorPickerRef.current?.handleSetThemeColor()}
      hasData={hasColor}
    >
      <ColorPicker ref={colorPickerRef} onColorSelect={() => setHasColor(true)} />
    </FormCard>
  )
}
