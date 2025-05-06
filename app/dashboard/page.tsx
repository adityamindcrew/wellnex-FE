import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to Your WellnexAI Dashboard</h1>
        <p className="text-muted-foreground">Your chatbot is now ready to be configured and deployed.</p>
        <div className="rounded-md bg-green-50 p-4 text-green-700">Setup completed successfully!</div>
        <Button asChild className="bg-purple-500 hover:bg-purple-600">
          <Link href="/onboarding/step-1">Restart Onboarding</Link>
        </Button>
      </div>
    </div>
  )
}
