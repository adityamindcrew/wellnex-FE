"use client"
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscriptionPlans from './SubscriptionPlans';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? (() => { throw new Error("Stripe key missing"); })()
  );
const StripeProvider = () => {
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionPlans />
        </Elements>
    );
};

export default StripeProvider; 