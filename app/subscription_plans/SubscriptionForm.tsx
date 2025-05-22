"use client"
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import SubscriptionStatus from './SubscriptionStatus';

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover';

// Card brand icons mapping with SVG icons
const cardIcons: Record<CardBrand | 'default', React.ReactElement> = {
    visa: (
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="#1A1F71" d="M22.4 4.4H1.6C.7 4.4 0 5.1 0 6v12c0 .9.7 1.6 1.6 1.6h20.8c.9 0 1.6-.7 1.6-1.6V6c0-.9-.7-1.6-1.6-1.6z" />
            <path fill="#F7B600" d="M22.4 4.4H1.6C.7 4.4 0 5.1 0 6v12c0 .9.7 1.6 1.6 1.6h20.8c.9 0 1.6-.7 1.6-1.6V6c0-.9-.7-1.6-1.6-1.6z" />
        </svg>
    ),
    mastercard: (
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="#EB001B" d="M12 4.4c-4.2 0-7.6 3.4-7.6 7.6s3.4 7.6 7.6 7.6 7.6-3.4 7.6-7.6-3.4-7.6-7.6-7.6z" />
            <path fill="#F79E1B" d="M12 4.4c-4.2 0-7.6 3.4-7.6 7.6s3.4 7.6 7.6 7.6 7.6-3.4 7.6-7.6-3.4-7.6-7.6-7.6z" />
        </svg>
    ),
    amex: (
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="#006FCF" d="M22.4 4.4H1.6C.7 4.4 0 5.1 0 6v12c0 .9.7 1.6 1.6 1.6h20.8c.9 0 1.6-.7 1.6-1.6V6c0-.9-.7-1.6-1.6-1.6z" />
        </svg>
    ),
    discover: (
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="#FF6000" d="M12 4.4c-4.2 0-7.6 3.4-7.6 7.6s3.4 7.6 7.6 7.6 7.6-3.4 7.6-7.6-3.4-7.6-7.6-7.6z" />
        </svg>
    ),
    default: (
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="#666" d="M22.4 4.4H1.6C.7 4.4 0 5.1 0 6v12c0 .9.7 1.6 1.6 1.6h20.8c.9 0 1.6-.7 1.6-1.6V6c0-.9-.7-1.6-1.6-1.6z" />
        </svg>
    )
};

const SubscriptionForm = ({ priceId }: { priceId: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [cardholderName, setCardholderName] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [cardToRemove, setCardToRemove] = useState<string | null>(null);
    const [animatingCard, setAnimatingCard] = useState<string | null>(null);

    // Fetch existing subscription and saved cards on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch existing subscription
                const subscriptionResponse = await fetch('https://wellnexai.com/api/subscription/status', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (subscriptionResponse.ok) {
                    const subscriptionData = await subscriptionResponse.json();
                    setSubscriptionId(subscriptionData.id);
                }

                // Fetch saved cards
                const cardsResponse = await fetch('https://wellnexai.com/api/subscription/cards', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (cardsResponse.ok) {
                    const cardsData = await cardsResponse.json();
                    setSavedCards(cardsData);
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Sort cards: default first, then by brand and last4
    const sortedCards = [...savedCards].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
        return a.last4.localeCompare(b.last4);
    });

    // Check if card is expiring soon (within 3 months)
    const isExpiringSoon = (expMonth: number, expYear: number) => {
        const now = new Date();
        const expDate = new Date(expYear, expMonth - 1);
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return expDate <= threeMonthsFromNow;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!stripe || !elements) {
                throw new Error('Stripe has not loaded yet');
            }

            if (!priceId) {
                throw new Error('No plan selected');
            }

            let paymentMethodId;

            if (selectedCard) {
                paymentMethodId = selectedCard;
            } else {
                if (!cardholderName.trim()) {
                    throw new Error('Please enter cardholder name');
                }
                const cardElement = elements.getElement(CardElement);
                if (!cardElement) return;
                const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                    billing_details: {
                        name: cardholderName,
                    },
                });

                if (cardError) {
                    throw new Error(cardError.message);
                }

                paymentMethodId = paymentMethod.id;
            }

            const response = await fetch('https://wellnexai.com/api/subscription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    paymentMethodId,
                    priceId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create subscription');
            }

            setSubscriptionId(data.subscriptionId);

            // Only clear form if it's a new card
            if (!data.isNewCard) {
                if (elements && elements.getElement(CardElement)) {
                    elements.getElement(CardElement)?.clear();
                }
                setSelectedCard(null);
                setCardholderName('');
            }

            // Refresh saved cards list
            const cardsResponse = await fetch('https://wellnexai.com/api/subscription/cards', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (cardsResponse.ok) {
                const cardsData = await cardsResponse.json();
                setSavedCards(cardsData);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle card removal with animation
    const handleRemoveCard = async (cardId: string) => {
        setAnimatingCard(cardId);
        setTimeout(() => {
            setCardToRemove(cardId);
            setShowConfirmDialog(true);
            setAnimatingCard(null);
        }, 300);
    };

    const confirmRemoveCard = async () => {
        try {
            const response = await fetch(`https://wellnexai.com/api/subscription/cards/${cardToRemove}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove card');
            }

            // Refresh saved cards list
            const cardsResponse = await fetch('https://wellnexai.com/api/subscription/cards', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (cardsResponse.ok) {
                const cardsData = await cardsResponse.json();
                setSavedCards(cardsData);
            }

            setMessage('Card removed successfully');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setShowConfirmDialog(false);
            setCardToRemove(null);
        }
    };

    if (initialLoading) {
        return <div>Loading subscription information...</div>;
    }

    return (
        <div className="subscription-container">
            {subscriptionId ? (
                <SubscriptionStatus subscriptionId={subscriptionId} />
            ) : (
                <form onSubmit={handleSubmit} className="subscription-form">
                    <h2>Subscribe to Premium Plan</h2>

                    {savedCards.length > 0 && (
                        <div className="saved-cards">
                            <h3>Saved Cards</h3>
                            <div className="card-list">
                                {sortedCards.map((card: any) => {
                                    const expiringSoon = isExpiringSoon(card.exp_month, card.exp_year);
                                    return (
                                        <div
                                            key={card.id}
                                            className={`card-item ${selectedCard === card.id ? 'selected' : ''} ${animatingCard === card.id ? 'removing' : ''}`}
                                        >
                                            <div className="card-info" onClick={() => setSelectedCard(card.id)}>
                                                <span className="card-icon">
                                                    {cardIcons[(card.brand.toLowerCase() as CardBrand)] || cardIcons.default}
                                                </span>
                                                <div className="card-details">
                                                    <span className="card-brand">{card.brand}</span>
                                                    <span className="card-last4">**** **** **** {card.last4}</span>
                                                    <span className={`card-expiry ${expiringSoon ? 'expiring-soon' : ''}`}>
                                                        Expires {card.exp_month}/{card.exp_year}
                                                        {expiringSoon && (
                                                            <span className="expiry-warning">
                                                                (Expiring soon)
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                {card.isDefault && (
                                                    <span className="default-badge">Default</span>
                                                )}
                                            </div>
                                            <div className="card-actions">
                                                <button
                                                    type="button"
                                                    className="action-button remove"
                                                    onClick={() => handleRemoveCard(card.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                type="button"
                                className="use-new-card"
                                onClick={() => setSelectedCard(null)}
                            >
                                Use New Card
                            </button>
                        </div>
                    )}

                    {!selectedCard && (
                        <div className="card-element-container">
                            <div className="form-group">
                                <label htmlFor="cardholder-name">Cardholder Name</label>
                                <input
                                    id="cardholder-name"
                                    type="text"
                                    value={cardholderName}
                                    onChange={(e) => setCardholderName(e.target.value)}
                                    placeholder="Name as it appears on card"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Card Details</label>
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '16px',
                                                color: '#424770',
                                                '::placeholder': {
                                                    color: '#aab7c4',
                                                },
                                            },
                                            invalid: {
                                                color: '#9e2146',
                                            },
                                        },
                                        hidePostalCode: false,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !stripe}
                        className="subscribe-button"
                    >
                        {loading ? 'Processing...' : 'Subscribe Now'}
                    </button>
                </form>
            )}

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Remove Card</h3>
                        <p>Are you sure you want to remove this card? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="modal-button cancel"
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setCardToRemove(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="modal-button confirm"
                                onClick={confirmRemoveCard}
                            >
                                Remove Card
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .subscription-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .subscription-form {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    margin-bottom: 20px;
                    color: #333;
                }

                .saved-cards {
                    margin-bottom: 20px;
                }

                .card-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .card-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    margin-bottom: 10px;
                    transition: all 0.2s ease;
                    animation: slideIn 0.3s ease-out;
                }

                .card-item:hover {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .card-item.removing {
                    animation: slideOut 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideOut {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                }

                .card-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    flex: 1;
                }

                .card-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    padding: 8px;
                }

                .card-icon svg {
                    width: 100%;
                    height: 100%;
                }

                .card-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .card-brand {
                    font-weight: 600;
                    color: #333;
                }

                .card-last4 {
                    font-family: monospace;
                    color: #666;
                }

                .card-expiry {
                    font-size: 14px;
                    color: #666;
                }

                .default-badge {
                    background-color: #4CAF50;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                }

                .card-actions {
                    display: flex;
                    gap: 10px;
                }

                .action-button {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .action-button.set-default {
                    background-color: #2196F3;
                    color: white;
                }

                .action-button.remove {
                    background-color: #f44336;
                    color: white;
                }

                .action-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .action-button:active {
                    transform: translateY(0);
                }

                .use-new-card {
                    background: none;
                    border: none;
                    color: #2196F3;
                    cursor: pointer;
                    padding: 5px 0;
                    font-size: 14px;
                }

                .card-element-container {
                    margin: 20px 0;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 10px;
                    color: #666;
                }

                .form-group input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    font-size: 16px;
                    margin-bottom: 15px;
                }

                .form-group input:focus {
                    border-color: #2196F3;
                    outline: none;
                }

                .success-message {
                    color: #2e7d32;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #2e7d32;
                    border-radius: 4px;
                    background-color: #f1f8e9;
                }

                .error-message {
                    color: #9e2146;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #9e2146;
                    border-radius: 4px;
                    background-color: #fff5f5;
                }

                .subscribe-button {
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

                .subscribe-button:hover {
                    background-color: #1976D2;
                }

                .subscribe-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 8px;
                    max-width: 400px;
                    width: 90%;
                }

                .modal-content h3 {
                    margin: 0 0 16px 0;
                    color: #333;
                }

                .modal-content p {
                    margin: 0 0 24px 0;
                    color: #666;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .modal-button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s ease;
                }

                .modal-button.cancel {
                    background-color: #e0e0e0;
                    color: #333;
                }

                .modal-button.confirm {
                    background-color: #f44336;
                    color: white;
                }

                .modal-button:hover {
                    opacity: 0.9;
                }

                .expiring-soon {
                    color: #f44336;
                }

                .expiry-warning {
                    font-size: 12px;
                    color: #f44336;
                    margin-left: 8px;
                    font-style: italic;
                }

                .card-item.selected {
                    border-color: #2196F3;
                    background-color: #E3F2FD;
                    transform: scale(1.02);
                    transition: all 0.2s ease;
                }
            `}</style>
        </div>
    );
};

export default SubscriptionForm; 