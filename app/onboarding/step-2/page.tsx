"use client"

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import FormCard from "../components/form-card"
import ColorPicker from "./color-picker"

export default function OnboardingStep2() {
  const router = useRouter();
  const colorPickerRef = useRef<{ handleSetThemeColor: () => void }>(null);
  // useEffect(() => {
  //   const onboardingStep = localStorage.getItem("onboardingStep");
  //   if (onboardingStep === "5") {
  //     router.replace("/onboarding/step-5");
  //   } else {
  //     localStorage.setItem("onboardingStep", "2");
  //   }
  // }, [router]);

  return (
    <FormCard
      title="Choose Your Color"
      description="This will set the visual appearance of your chatbot to match your website and brand."
      showBack={true}
      onNext={() => colorPickerRef.current?.handleSetThemeColor()}
    >
      <ColorPicker ref={colorPickerRef} />
    </FormCard>
  )
}
