"use client"
import React, { useState, useEffect } from 'react';

interface Subscription {
    status: string;
    amount: number;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

const SubscriptionStatus = ({ subscriptionId }: { subscriptionId: string }) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (subscriptionId) {
            pollSubscriptionStatus();
            // Poll every 5 seconds
            const interval = setInterval(pollSubscriptionStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [subscriptionId]);

    const pollSubscriptionStatus = async () => {
        try {
            const response = await fetch(`http://localhost:3000/subscription/status`, {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ3ZWxsbmV4dXNlcnMiLCJzdWIiOnsiX2lkIjoiNjgxYzQxZjlkZmMzYTFiYzBjMTU2NTJlIiwiZmlyc3ROYW1lIjoiQUJDRCBDb21wYW55IiwiZW1haWwiOiJhYmMxQG1haWxpbmF0b3IuY29tIiwicm9sZXMiOiJidXNpbmVzcyIsImNyZWF0ZWRBdCI6IjIwMjUtMDUtMDhUMDU6MzI6NDEuODUxWiIsInVwZGF0ZWRBdCI6IjIwMjUtMDUtMjBUMDY6MDk6MDcuMDgxWiJ9LCJpYXQiOjE3NDc4MDgwNzA5MzgsImV4cCI6MTc1MDQwMDA3MDkzOH0.Zg1eVHB5mXq_M5MdTgHpIc9fRpIYaKLZUjGz-GdrVyQ'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch subscription status');
            }

            const data = await response.json();
            setSubscription(data);
            setLoading(false);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#4CAF50';
            case 'incomplete':
            case 'incomplete_expired':
                return '#FFA500';
            case 'past_due':
            case 'unpaid':
                return '#FF0000';
            case 'canceled':
                return '#808080';
            default:
                return '#000000';
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'active':
                return 'Your subscription is active';
            case 'incomplete':
                return 'Processing your subscription...';
            case 'incomplete_expired':
                return 'Initial payment failed. Please try again.';
            case 'past_due':
                return 'Payment is past due. Please update your payment method.';
            case 'unpaid':
                return 'Subscription is unpaid. Please update your payment method.';
            case 'canceled':
                return 'Subscription has been canceled';
            default:
                return 'Unknown status';
        }
    };

    if (loading) {
        return <div>Loading subscription status...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!subscription) {
        return <div>No active subscription found</div>;
    }

    return (
        <div className="subscription-status">
            <div className="status-header">
                <h3>Subscription Status</h3>
                <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(subscription.status) }}
                >
                    {subscription.status.toUpperCase()}
                </span>
            </div>

            <div className="status-details">
                <p className="status-message">{getStatusMessage(subscription.status)}</p>
                
                <div className="subscription-info">
                    <div className="info-item">
                        <span className="label">Amount:</span>
                        <span className="value">${subscription.amount}/month</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Current Period:</span>
                        <span className="value">
                            {new Date(subscription.currentPeriodStart).toLocaleDateString()} - 
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </span>
                    </div>
                    {subscription.cancelAtPeriodEnd && (
                        <div className="info-item warning">
                            <span className="label">Note:</span>
                            <span className="value">Subscription will end at the current period</span>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .subscription-status {
                    padding: 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background: white;
                    margin: 20px 0;
                }

                .status-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .status-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                }

                .status-details {
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 4px;
                }

                .status-message {
                    font-size: 16px;
                    margin-bottom: 15px;
                }

                .subscription-info {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .info-item {
                    display: flex;
                    gap: 10px;
                }

                .label {
                    font-weight: bold;
                    min-width: 120px;
                }

                .warning {
                    color: #856404;
                    background-color: #fff3cd;
                    padding: 10px;
                    border-radius: 4px;
                }

                .error-message {
                    color: #9e2146;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #9e2146;
                    border-radius: 4px;
                    background-color: #fff5f5;
                }
            `}</style>
        </div>
    );
};

export default SubscriptionStatus; 