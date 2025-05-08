import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import LogoUploader from "./logo-uploader"
import StepIndicator from "../components/step-indicator"

export default function LogoUploadPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6 px-4 py-8">
            <div className="max-w-md space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Now, let's upload your logo.</h1>
              <p className="text-muted-foreground">
                Your logo will appear on your AI chatbot to match your brand and create a trusted experience for your
                customers.
              </p>
            </div>

            <LogoUploader />

            <div className="flex w-full items-center justify-between pt-8">
              <StepIndicator currentStep={1} totalSteps={4} />
              <div className="flex space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Next</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
