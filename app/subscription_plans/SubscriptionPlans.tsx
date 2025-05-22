"use client"
import React, { useState, useEffect } from 'react';
import SubscriptionForm from './SubscriptionForm';

interface Plan {
    id: string;
    name: string;
    amount: number;
    interval: string;
    description: string;
    features: string[];
    isPopular?: boolean;
}

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await fetch('http://localhost:3000/subscription/plans', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch subscription plans');
            }

            const data = await response.json();
            setPlans(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading subscription plans...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (selectedPlan) {
        return (
            <div>
                <button 
                    className="back-button"
                    onClick={() => setSelectedPlan(null)}
                >
                    ← Back to Plans
                </button>
                <SubscriptionForm priceId={selectedPlan.id} />
            </div>
        );
    }

    return (
        <div className="plans-container">
            <h2>Choose Your Plan</h2>
            <div className="plans-grid">
                {plans.map((plan: any) => (
                    <div
                        key={plan.id}
                        className={`plan-card ${plan.isPopular ? 'popular' : ''}`}
                    >
                        {plan.isPopular && (
                            <div className="popular-badge">Most Popular</div>
                        )}
                        <h3>{plan.name}</h3>
                        <div className="price">
                            <span className="amount">${plan.amount}</span>
                            <span className="interval">/{plan.interval}</span>
                        </div>
                        <p className="description">{plan.description}</p>
                        <ul className="features">
                            {plan.features.map((feature: string, index: number) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <button 
                            className="select-plan-button"
                            onClick={() => setSelectedPlan(plan)}
                        >
                            Select Plan
                        </button>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .plans-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                h2 {
                    text-align: center;
                    margin-bottom: 40px;
                    color: #333;
                }

                .plans-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 30px;
                    justify-content: center;
                }

                .plan-card {
                    background: white;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    position: relative;
                    transition: transform 0.2s ease;
                }

                .plan-card:hover {
                    transform: translateY(-5px);
                }

                .plan-card.popular {
                    border: 2px solid #2196F3;
                }

                .popular-badge {
                    position: absolute;
                    top: -12px;
                    right: 20px;
                    background: #2196F3;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                }

                h3 {
                    margin: 0 0 20px;
                    color: #333;
                }

                .price {
                    margin-bottom: 20px;
                }

                .amount {
                    font-size: 36px;
                    font-weight: bold;
                    color: #333;
                }

                .interval {
                    color: #666;
                    font-size: 16px;
                }

                .description {
                    color: #666;
                    margin-bottom: 20px;
                    min-height: 40px;
                }

                .features {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 30px;
                }

                .features li {
                    padding: 8px 0;
                    color: #666;
                    position: relative;
                    padding-left: 25px;
                }

                .features li:before {
                    content: "✓";
                    color: #4CAF50;
                    position: absolute;
                    left: 0;
                }

                .select-plan-button {
                    width: 100%;
                    padding: 12px;
                    background-color: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .select-plan-button:hover {
                    background-color: #1976D2;
                }

                .back-button {
                    background: none;
                    border: none;
                    color: #2196F3;
                    font-size: 16px;
                    cursor: pointer;
                    padding: 10px 0;
                    margin-bottom: 20px;
                }

                .back-button:hover {
                    text-decoration: underline;
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

export default SubscriptionPlans; 