import BusinessQuestions from "@/components/dashboard/business-questions"
import BusinessKeywords from "@/components/dashboard/business-keywords"
import PlatformSubscription from "@/components/dashboard/platform-subscription"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <BusinessQuestions />
      <BusinessKeywords />
      <PlatformSubscription />
    </div>
  )
}
