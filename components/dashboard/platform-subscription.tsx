'use client'
import { useState } from "react";

export default function PlatformSubscription() {
  const [error, setError] = useState<string | null>(null);
  const [showSpecialOffer, setShowSpecialOffer] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('https://wellnexai.com/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const data = await response.json();
      if (data.hasSpecialOffer) {
        setShowSpecialOffer(true);
      } else {
        setMessage('Your subscription has been cancelled');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRenewSubscription = async () => {
    try {
      const response = await fetch('https://wellnexai.com/api/subscription/renew-after-special-offer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to renew subscription');
      }

      setShowSpecialOffer(false);
      setMessage('Your subscription has been renewed for one more month');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleConfirmCancel = () => {
    setShowSpecialOffer(false);
    setMessage('Your subscription has been cancelled');
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Platform Subscription</h2>
      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
        <div className="w-full lg:w-[400px] rounded-lg border border-gray-200 bg-white p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-500">Subscription Status</div>
              <div className="text-sm font-medium">Active</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-500">Start Date</div>
              <div className="text-sm">2025-05-15</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-500">Next Renewal Date</div>
              <div className="text-sm">2025-06-15</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div className="text-sm">info@businessgmail.com</div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="rounded-md bg-black px-4 py-2 text-sm text-white">Renew Now</button>
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
                  fill="#666666"
                />
                <path d="M14 17H10V15H14V17ZM16 13H8V11H16V13ZM16 9H8V7H16V9Z" fill="#666666" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium">Change Logo (.png )</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex gap-1">
              <div className="h-12 w-12 rounded-full bg-purple-300"></div>
              <div className="h-12 w-12 rounded-full bg-purple-800"></div>
            </div>
            <div>
              <div className="text-sm font-medium">Change Color Theme</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2 justify-center">
            <button className="rounded-md bg-black px-4 py-2 text-sm text-white">Reset Theme</button>
            <button className="rounded-md bg-black px-4 py-2 text-sm text-white">Save Changes</button>
          </div>
        </div>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <button
        className="cancel-button"
        onClick={handleCancelSubscription}
      >
        Cancel Subscription
      </button>
      {showSpecialOffer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Special Offer</h3>
            <p>Would you like to continue your subscription for one more month at a special rate?</p>
            <div className="modal-actions">
              <button
                className="modal-button cancel"
                onClick={handleConfirmCancel}
              >
                No, Cancel
              </button>
              <button
                className="modal-button confirm"
                onClick={handleRenewSubscription}
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
                .cancel-button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #f44336;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .cancel-button:hover {
                    background-color: #d32f2f;
                }

                .success-message {
                    color: #2e7d32;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #2e7d32;
                    border-radius: 4px;
                    background-color: #f1f8e9;
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
                    background-color: #2196F3;
                    color: white;
                }

                .modal-button:hover {
                    opacity: 0.9;
                }
            `}</style>
    </div>
  )
}
