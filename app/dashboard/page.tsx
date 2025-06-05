import BusinessQuestions from "@/components/dashboard/business-questions"
import BusinessKeywords from "@/components/dashboard/business-keywords"
import PlatformSubscription from "@/components/dashboard/platform-subscription"
import BusinessServices from "@/components/dashboard/business-services"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <BusinessQuestions />
      <BusinessKeywords />
      <BusinessServices />
      <PlatformSubscription />
    </div>
  )
}
