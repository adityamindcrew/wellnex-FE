"use client"
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscriptionPlans from './SubscriptionPlans';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51LuNV2E2Y7YLkjxVuaZ1F13llOwUjsRcrodK7nbLAxmqxcnKqjnWxlc83V53bnFdnWOSW07fvBQjEmKXp2ChPXNo004z40bvvz');

const StripeProvider = () => {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3ZWxsbmV4dXNlcnMiLCJzdWIiOnsiX2lkIjoiNjgxYzQxZjlkZmMzYTFiYzBjMTU2NTJlIiwiZmlyc3ROYW1lIjoiQUJDRCBDb21wYW55IiwiZW1haWwiOiJhYmMxQG1haWxpbmF0b3IuY29tIiwicm9sZXMiOiJidXNpbmVzcyIsImNyZWF0ZWRBdCI6IjIwMjUtMDUtMDhUMDU6MzI6NDEuODUxWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDUtMjBUMDY6MDk6MDcuMDgxWiJ9LCJpYXQiOjE3NDc4MDgwNzA5MzgsImV4cCI6MTc1MDQwMDA3MDkzOH0.Zg1eVHB5mXq_M5MdTgHpIc9fRpIYaKLZUjGz-GdrVyQ')
    return (
        <Elements stripe={stripePromise}>
            <SubscriptionPlans />
        </Elements>
    );
};

export default StripeProvider; 