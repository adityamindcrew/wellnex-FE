"use client"
import { Suspense } from "react";
import PlanSelectionCard from "./planSelection"

export default function PlanSelectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <PlanSelectionCard />
    </div>
    </Suspense>
  )
}
