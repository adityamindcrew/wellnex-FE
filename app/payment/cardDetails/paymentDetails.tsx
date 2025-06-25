"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import CardImage from "../../assets/images/card.png";

// Stripe publishable key from your .env.local
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? (() => { throw new Error("Stripe key missing"); })()
);
function PaymentForm({ priceId }: { priceId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    const currency = localStorage.getItem("planCurrency");
    const amount = localStorage.getItem("planAmount");
    setPaymentAmount(`${currency} ${amount}`);
  }, []);

  // Listen to Stripe Element changes for preview
  const handleNumberChange = (e: any) => setCardNumber(e.complete ? e.value : "");
  const handleExpiryChange = (e: any) => setExpiry(e.complete ? e.value : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe not loaded");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please login first.");
      }

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: cardName },
      });

      if (pmError) {
        throw new Error(pmError.message || "Payment error");
      }

      if (!paymentMethod?.id) {
        throw new Error("Failed to create payment method");
      }

      // Call your backend API
      const response = await fetch("http://13.61.105.209/api/subscription/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      if (data.error) {
        throw new Error(data.error);
      }
      const { error: cardError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret);
      if (cardError) {
        // Display error to user
        console.error('Payment failed:', cardError.message);
        setError(cardError.message ?? 'Payment failed. Try Again.')
      } else {
        if (paymentIntent && paymentIntent.status === "succeeded") {
          router.push("/payment/success");
        } else if (paymentIntent) {
          setError("Subscription Status is " + paymentIntent?.status)
        } else
          setError("Payment failed. Try Again.")
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err instanceof Error ? err.message : "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg px-8 py-6 w-full max-w-[500px] flex flex-col items-center">
      <Image
        src={CardImage}
        alt="Card Preview"
        width={400}
        height={140}
        className="mb-6 rounded-xl shadow-md"
      />
      <div className="w-full">
        <div className="mb-1 font-semibold text-[#181D27] text-lg">Payment</div>
        <div className="mb-4 text-sm text-[#535862]">Card details.</div>
        <div className="flex w-full gap-4 mb-3">
          <div className="flex-[3]">
            <label className="block text-sm font-medium text-[#414651] mb-1">Name on card</label>
            <input
              className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-base focus:border-black focus:ring-0"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#414651] mb-1">Expiry</label>
            <CardExpiryElement
              className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-base focus:border-black focus:ring-0"
              onChange={handleExpiryChange}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    lineHeight: "1.5",
                    '::placeholder': { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
        </div>
        <div className="flex w-full gap-4 mb-1">
          <div className="flex-[3]">
            <label className="block text-sm font-medium text-[#414651] mb-1">Card number</label>
            <CardNumberElement
              className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-base focus:border-black focus:ring-0"
              onChange={handleNumberChange}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    lineHeight: "2.2",
                    '::placeholder': { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#414651] mb-1">CVV</label>
            <CardCvcElement
              className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-base focus:border-black focus:ring-0"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    lineHeight: "2.2",
                    '::placeholder': { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
        </div>
      </div>
      {error && <div className="text-red-500 mt-3 text-base w-full text-center">{error}</div>}
      <div className="flex w-full mt-6 gap-3">
        {/* <button type="button" className="flex-1 py-2.5 rounded-md border border-gray-300 bg-white text-gray-700 text-base">Cancel</button> */}
        <button type="submit" className="flex-1 py-2.5 rounded-md bg-black text-white font-semibold text-base" disabled={loading}>
          {loading ? "Processing..." : `Pay ${paymentAmount}`}
        </button>
      </div>
    </form>
  );
}

export default function PaymentDetailsForm({ priceId }: { priceId: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F5]">
      <Elements stripe={stripePromise}>
        <PaymentForm priceId={priceId} />
      </Elements>
    </div>
  );
}
