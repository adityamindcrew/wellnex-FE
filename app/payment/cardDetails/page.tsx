"use client"

import PaymentDetailsForm from "./paymentDetails"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? (() => { throw new Error("Stripe key missing"); })()
);

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
