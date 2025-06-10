"use client"
import { useRouter } from "next/navigation";
import FormCard from "../components/form-card"
import WelcomeScreen from "./welcome-screen"

export default function OnboardingStep5() {
  const router = useRouter();

  return (
    <FormCard title="Welcome to WellnexAI" description="" showBack={false} showNext={false} showCancel={false}>
      <WelcomeScreen />
    </FormCard>
  )
}
