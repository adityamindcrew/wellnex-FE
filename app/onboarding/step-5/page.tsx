import FormCard from "../components/form-card"
import WelcomeScreen from "./welcome-screen"

export default function WelcomePage() {
  return (
    <FormCard title="Welcome to WellnexAI" description="" showBack={false} showNext={false} showCancel={false}>
      <WelcomeScreen />
    </FormCard>
  )
}
