"use client"

import PaymentDetailsForm from "./paymentDetails"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51LuNV2E2Y7YLkjxVuaZ1F13llOwUjsRcrodK7nbLAxmqxcnKqjnWxlc83V53bnFdnWOSW07fvBQjEmKXp2ChPXNo004z40bvvz');

export default function PaymentDetailsPage() {
  const [priceId, setPriceId] = useState("");

  useEffect(() => {
    const storedPriceId = localStorage.getItem("priceId");
    if (storedPriceId) setPriceId(storedPriceId);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Elements stripe={stripePromise}>
        <PaymentDetailsForm priceId={priceId} />
      </Elements>
    </div>
  )
}
