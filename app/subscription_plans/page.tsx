"use client"
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscriptionPlans from './SubscriptionPlans';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51LuNV2E2Y7YLkjxVuaZ1F13llOwUjsRcrodK7nbLAxmqxcnKqjnWxlc83V53bnFdnWOSW07fvBQjEmKXp2ChPXNo004z40bvvz');

const StripeProvider = () => {
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionPlans />
        </Elements>
    );
};

export default StripeProvider; 