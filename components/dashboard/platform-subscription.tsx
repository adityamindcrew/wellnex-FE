'use client'
import { useState, useRef, useEffect, useCallback } from "react";
import { businessApi } from "../../app/services/api";
import { API_BASE_URL } from "../../lib/api/config";
import Image from "next/image";
import { ImageIcon, ChevronDown, ChevronUp, PipetteIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, useStripe, useElements, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? (() => { throw new Error("Stripe key missing"); })()
);

// Function to compress image
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      const maxDimension = 800; // Maximum dimension

      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Convert to blob with compression
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/png',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, 'image/png', 0.8); // 80% quality
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

function PaymentForm({ onPaymentMethodCreated, isForChangeCard = false }: { onPaymentMethodCreated: (paymentMethodId: string) => void, isForChangeCard?: boolean }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardName, setCardName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  // useEffect(() => {
  //   // const currency = localStorage.getItem("planCurrency");
  //   // const amount = localStorage.getItem("planAmount");
  //   setPaymentAmount(`${currency} ${amount}`);
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe not loaded");
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

      onPaymentMethodCreated(paymentMethod.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create payment method");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl px-8 py-6 w-full max-w-[600px] flex flex-col items-center">
      <div className="w-full">
        <div className="mb-1 font-semibold text-[#181D27] text-lg">Payment</div>
        <div className="mb-4 text-sm text-[#535862]">Card details.</div>
        <div className="flex w-full gap-6 mb-4">
          <div className="flex-[6]">
            <label className="block text-sm font-medium text-[#414651] mb-1">Name on card</label>
            <input
              className="block w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-black focus:ring-0"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              required
            />
          </div>
          <div className="flex-[4]">
            <label className="block text-sm font-medium text-[#414651] mb-1">Expiry</label>
            <CardExpiryElement
              className="block w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-black focus:ring-0"
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
        <div className="flex w-full gap-6 mb-4">
          <div className="flex-[6]">
            <label className="block text-sm font-medium text-[#414651] mb-1">Card number</label>
            <CardNumberElement
              className="block w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-black focus:ring-0"
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
          <div className="flex-[4]">
            <label className="block text-sm font-medium text-[#414651] mb-1">CVV</label>
            <CardCvcElement
              className="block w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-black focus:ring-0"
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
        <button type="submit" className="flex-1 py-2.5 rounded-md bg-black text-white font-semibold text-base" disabled={loading}>
          {loading ? "Processing..." : isForChangeCard ? "Add New Card" : `Pay ${paymentAmount}`}
        </button>
      </div>
    </form>
  );
}

export default function PlatformSubscription() {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState("#987CF1");
  const [isLoading, setIsLoading] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [showSpecialOffer, setShowSpecialOffer] = useState(false);
  const [showNoSubscriptionPopup, setShowNoSubscriptionPopup] = useState(false);
  const [showPausedSubscriptionPopup, setShowPausedSubscriptionPopup] = useState(false);
  const [specialOfferPrice, setSpecialOfferPrice] = useState<number | null>(null);
  const [specialOfferMessage, setSpecialOfferMessage] = useState<string>("");
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [message1, setMessage1] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialColor, setInitialColor] = useState("#987CF1");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const gradientRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const [gradientPos, setGradientPos] = useState({ x: 0, y: 0 });
  const [huePos, setHuePos] = useState(0);

  // Subscription status state
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showRenewSubscription, setShowRenewSubscription] = useState(false);
  const [showRenewSavedCards, setShowRenewSavedCards] = useState(false);
  const [specialOfferExpiry, setSpecialOfferExpiry] = useState<string>("");
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showSavedCards, setShowSavedCards] = useState(false);
  const [isPaymentFormForChangeCard, setIsPaymentFormForChangeCard] = useState(false);
  const [specialOfferReason, setSpecialOfferReason] = useState<string>("");

  const handleLogout = useCallback(async () => {
    try {
      // First, call the server logout endpoint
      const response = await fetch(`${API_BASE_URL}/business/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()

      // Clear all cookies
      const cookies = document.cookie.split(";")
      cookies.forEach(cookie => {
        const [name] = cookie.split("=")
        document.cookie = `${name.trim()}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      })

      // Force a complete page reload to signin
      window.location.href = '/signin'
    } catch (err) {
      console.error("Logout error:", err)
      // Even if the server call fails, try to clear everything locally
      localStorage.clear()
      sessionStorage.clear()
      document.cookie.split(";").forEach(cookie => {
        const [name] = cookie.split("=")
        document.cookie = `${name.trim()}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      })
      window.location.href = '/signin'
    }
  }, [router])
  const fetchBusinessDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const businessId = localStorage.getItem('businessId');
      if (!token || !businessId) return;

      const response = await fetch(`${API_BASE_URL}/business/getBusinessDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.replace(/['"]/g, '')}`
        },
        body: JSON.stringify({ businessId })
      });
      const data = await response.json();
      if (data.data) {

        // Set logo if available
        if (data.data.logo) {
          setLogoUrl(`https://wellnexai.com/uploads/business-logos/${data.data.logo}`);
          localStorage.setItem('businessLogo', `https://wellnexai.com/uploads/business-logos/${data.data.logo}`);
        }
        // Set theme color if available
        if (data.data.themeColor) {
          setSelectedColor(data.data.themeColor);
          setInitialColor(data.data.themeColor);
          localStorage.setItem('themeColor', data.data.themeColor);
        }
        if (data.data.subscriptionDetail.status === 'paused') {
          setShowPausedSubscriptionPopup(true)
          setTimeout(() => {
            handleLogout()
          }, 10000);
        } else if (data.data.subscriptionDetail.status === 'canceled' || data.data.subscriptionDetail.status === 'incomplete') {
          setShowNoSubscriptionPopup(true);
        }
      } else if (data.message === "Error getting subscription details: No active subscription found" || data.message === "No active subscription found. Please subscribe to access dashboard features.") {
        setShowNoSubscriptionPopup(true);
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
    }
  };

  const fetchSubscription = async () => {
    setSubscriptionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const businessId = localStorage.getItem('businessId');
      if (!token || !businessId) {
        setSubscriptionLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/subscription/status?businessId=${businessId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.replace(/['"]/g, '')}`
        },
      });
      if (!response.ok) throw new Error('Failed to fetch subscription status');
      const data = await response.json();
      setSubscription(data || null);
    } catch (err) {
      setSubscription(null);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Load logo and theme color from API on component mount
  useEffect(() => {

    fetchBusinessDetails();
    fetchSubscription();
  }, []);

  // Update RGB when color changes
  useEffect(() => {
    if (!selectedColor) return;

    // Convert hex to rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
        : { r: 0, g: 0, b: 0 }
    }

    const rgb = hexToRgb(selectedColor)
    setR(rgb.r)
    setG(rgb.g)
    setB(rgb.b)
  }, [selectedColor]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setThemeError(null);

    if (!file) return;

    // Check if file is PNG
    if (!file.type.includes("png")) {
      setThemeError("Please upload a PNG file only");
      return;
    }

    // Check file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      setThemeError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    try {
      // Compress the image if it's larger than 1MB
      let processedFile = file;
      if (file.size > 1024 * 1024) { // 1MB
        processedFile = await compressImage(file);
      }

      // Show preview immediately and store in localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setPreviewUrl(base64String);
        localStorage.setItem('logoPreview', base64String);
        setSelectedFile(processedFile);
        setHasChanges(true);
      };
      reader.readAsDataURL(processedFile);
    } catch (err) {
      console.error('Error processing file:', err);
      setThemeError('Failed to process image. Please try again.');
    }
  };

  const handleSaveChanges = async () => {
    const hasLogoChanges = selectedFile !== null;
    const hasColorChanges = selectedColor !== initialColor;

    if (!hasLogoChanges && !hasColorChanges) {
      setMessage('No changes to save');
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setIsLoading(true);
      setThemeError(null);
      const token = localStorage.getItem('token');
      const businessId = localStorage.getItem('businessId');

      if (!token || !businessId) {
        throw new Error('Authentication token or business ID not found');
      }

      let changesMade = false;

      // Upload logo if a new file is selected
      if (hasLogoChanges && selectedFile) {
        try {
          const formData = new FormData();
          formData.append('logo', selectedFile);
          formData.append('businessId', businessId);

          const response = await fetch(`${API_BASE_URL}/business/uploadBusinessLogo`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          // Handle 413 error specifically
          if (response.status === 413) {
            throw new Error('File size too large. Please use a smaller image (max 5MB).');
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload logo');
          }

          const savedPreview = localStorage.getItem('logoPreview');
          if (savedPreview) {
            setLogoUrl(savedPreview);
            localStorage.setItem('businessLogo', savedPreview);
          }

          changesMade = true;
          setMessage('Logo updated successfully');
        } catch (err) {
          console.error('Logo upload error:', err);
          throw new Error('Failed to upload logo');
        }
      }

      // Update theme color if changed
      if (hasColorChanges) {
        try {
          await businessApi.setThemeColor(selectedColor, token, businessId);
          localStorage.setItem('themeColor', selectedColor);
          setInitialColor(selectedColor);
          changesMade = true;
          if (changesMade) {
            setMessage('Theme color updated successfully');
          }
        } catch (err) {
          console.error('Color update error:', err);
          throw new Error('Failed to update theme color');
        }
      }

      if (changesMade) {
        setHasChanges(false);
        setSelectedFile(null);
        setIsPickerOpen(false); // Close the color picker
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setThemeError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual hex input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`
    if (value.match(/^#([0-9A-F]{3}){1,2}$/i) || value === "#") {
      setSelectedColor(value)
      setThemeError(null)
      setHasChanges(true)
    }
  }

  // Handle RGB input changes
  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const clampedValue = Math.max(0, Math.min(255, numValue))

    if (component === "r") setR(clampedValue)
    if (component === "g") setG(clampedValue)
    if (component === "b") setB(clampedValue)

    // Update hex color
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    setSelectedColor(hex)
    setThemeError(null)
    setHasChanges(true)
  }

  // Handle click on the gradient
  const handleGradientClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gradientRef.current) return

    const rect = gradientRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setGradientPos({
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    })

    // Calculate color based on position and current hue
    updateColorFromPositions(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)), huePos)
    setThemeError(null)
    setHasChanges(true)
  }

  // Handle click on the hue slider
  const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueSliderRef.current) return

    const rect = hueSliderRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width

    setHuePos(Math.max(0, Math.min(1, x)))

    // Update color based on new hue and current gradient position
    updateColorFromPositions(gradientPos.x, gradientPos.y, Math.max(0, Math.min(1, x)))
    setThemeError(null)
    setHasChanges(true)
  }

  // Calculate color from positions
  const updateColorFromPositions = (gradX: number, gradY: number, huePosition: number) => {
    // Convert hue position to hue value (0-360)
    const hue = huePosition * 360

    // Calculate saturation and lightness from gradient position
    const saturation = gradX * 100
    const lightness = (1 - gradY) * 50 // Adjust for better visual match

    // Convert HSL to RGB
    const rgbColor = hslToRgb(hue, saturation, lightness)
    setR(rgbColor.r)
    setG(rgbColor.g)
    setB(rgbColor.b)

    // Convert RGB to hex
    const hex = `#${rgbColor.r.toString(16).padStart(2, "0")}${rgbColor.g.toString(16).padStart(2, "0")}${rgbColor.b.toString(16).padStart(2, "0")}`
    setSelectedColor(hex)
  }

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  const handleResetTheme = () => {
    // const defaultColor = "#987CF1";
    // setSelectedColor(defaultColor);
    // setInitialColor(defaultColor);
    localStorage.removeItem('logoPreview'); // Clear logo preview from localStorage
    setPreviewUrl(null);
    setSelectedFile(null);
    setHasChanges(true);
    setIsPickerOpen(false); // Close the color picker when resetting
  };
  const handleRenewSubscription = async () => {
    try {
      // Fetch saved cards
      const response = await fetch(`${API_BASE_URL}/subscription/cards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch saved cards');
      }

      const cardsData = await response.json();
      setSavedCards(cardsData);
      setShowRenewSavedCards(true);
    } catch (err) {
      console.error('Error fetching saved cards:', err);
      setSubscriptionError('Failed to fetch saved cards');
      // Fallback to direct payment form if cards fetch fails
      setShowRenewSubscription(true);
    }
  }

  const handleRenewSubscriptionAPI = async (paymentMethodId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/renew-after-special-offer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethodId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to renew subscription');
      }

      const data = await response.json();
      setShowRenewSubscription(false);
      setShowRenewSavedCards(false);
      setSelectedCard(null);

      setMessage1('Your subscription has been renewed successfully!');
      setTimeout(() => setMessage1(null), 3000);


      const token = localStorage.getItem('token');
      const businessId = localStorage.getItem('businessId');
      if (token && businessId) {
        const statusResponse = await fetch(`${API_BASE_URL}/subscription/status?businessId=${businessId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setSubscription(statusData || null);
        }
      }
    } catch (err: any) {
      setSubscriptionError(err.message);
      // Clear any existing message when there's an error
      setMessage1(null);
    }
  }

  const checkSpecialOffer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/check-special-offer`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check special offer');
      }

      const data = await response.json();

      if (data.hasSpecialOffer) {
        setSpecialOfferPrice(data.specialOfferPrice);
        setSpecialOfferMessage(data.message);
        setCurrentPeriodEnd(data.currentPeriodEnd);
        setSpecialOfferExpiry(data.expiryDate || "");
        setSpecialOfferReason(data.reason || "");
        setShowSpecialOffer(true);
      } else if (data.reason === "already_used") {
        setSpecialOfferMessage(data.message);
        setSpecialOfferReason(data.reason);
        setShowSpecialOffer(true);
      }
    } catch (err) {
      console.error('Error checking special offer:', err);
      setSubscriptionError('Failed to check special offer');
    }
  };

  const handleAcceptSpecialOffer = async () => {

    try {
      const createResponse = await fetch(`${API_BASE_URL}/subscription/apply-special-offer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // paymentMethodId: paymentMethodId
        })
      });

      const responseData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(responseData.message || 'Failed to create subscription');
      }

      setShowPaymentForm(false);
      setShowSpecialOffer(false);
      setSelectedCard(null);
      setMessage1('Subscription renewed! Offer applied for your next billing period.');
      setTimeout(() => setMessage1(null), 3000);
      fetchSubscription();
    } catch (err: any) {
      console.error('Subscription error:', err);
      setSubscriptionError(err.message || 'An error occurred while processing your subscription?. Please try again.');
      setShowPaymentForm(false);
      // Clear any existing message when there's an error
      setMessage1(null);
    }
    // Just close the special offer popup and optionally show a message
    setShowSpecialOffer(false);
    setMessage1('Subscription renewed! Offer applied for your next billing period'); // Optional: show a message
    setTimeout(() => setMessage1(null), 3000);
  };

  const handleDeclineSpecialOffer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const data = await response.json();
      setShowSpecialOffer(false);

      setMessage1(data.message || 'Your subscription has been cancelled');
      fetchSubscription();
    } catch (err: any) {
      setThemeError(err.message);
    }
  };

  const handlePaymentMethodCreated = async (paymentMethodId: string) => {
    try {
      const createResponse = await fetch(`${API_BASE_URL}/subscription/apply-special-offer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethodId
        })
      });
      const responseData = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(responseData.message || 'Failed to create subscription');
      }
      setShowPaymentForm(false);
      setShowSpecialOffer(false);
      setSelectedCard(null);
      setMessage1('Your subscription has been renewed successfully!');
      setTimeout(() => setMessage1(null), 3000);
      fetchSubscription();
    } catch (err: any) {
      console.error('Subscription error:', err);
      setSubscriptionError(err.message || 'An error occurred while processing your subscription?. Please try again.');
      setShowPaymentForm(false);
      setMessage1(null);
    }
  };

  const handleChangePaymentCard = async () => {
    try {
      setIsPaymentFormForChangeCard(true);
      setShowPaymentForm(true);
    } catch (err) {
      console.error('Error opening payment form:', err);
      setSubscriptionError('Failed to open payment form');
    }
  };

  const handlePaymentMethodCreatedForChange = async (paymentMethodId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/change-card`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethodId
        })
      });
      if (!response.ok) {
        throw new Error('Failed to change payment card');
      }
      const data = await response.json();
      setShowSavedCards(false);
      setShowPaymentForm(false);
      setSelectedCard(null);
      setMessage1('Payment card changed successfully!');
      setTimeout(() => setMessage1(null), 3000);
    } catch (err: any) {
      console.error('Change card error:', err);
      setSubscriptionError(err.message || 'An error occurred while changing your payment card. Please try again.');
      setShowSavedCards(false);
      setShowPaymentForm(false);
      setMessage1(null);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Platform Subscription</h2>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="w-full max-w-lg mx-auto lg:mx-0 lg:max-w-md rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-4">
          <div className="space-y-4">
            {subscriptionLoading ? (
              <div className="text-center text-gray-500 py-4">Loading subscription...</div>
            ) : subscription ? (
              <>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">Subscription Status</div>
                  <div className="text-sm font-medium">
                    {subscription?.status
                      ? subscription?.status === 'active' && subscription?.cancelAtPeriodEnd
                        ? 'Active'
                        : subscription?.status[0].toUpperCase() + subscription?.status.slice(1)
                      : 'N/A'}{subscription.isSpecialOffer && ' (Special Offer)'}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">Start Date</div>
                  <div className="text-sm">{subscription?.currentPeriodStart ? subscription?.currentPeriodStart.slice(0, 10) : 'N/A'}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">{subscription?.cancelAtPeriodEnd || subscription.isSpecialOffer ? 'End Date' : 'Next Renewal Date'}</div>
                  <div className="text-sm">
                    {subscription?.currentPeriodEnd ? subscription?.currentPeriodEnd.slice(0, 10) : 'N/A'}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-sm">{subscription?.email || 'N/A'}</div>
                </div>
              </>
            ) : (
              <div className="text-center text-red-500 py-4">No subscription data found.</div>
            )}
            {subscriptionError && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md">{subscriptionError}</div>
            )}
            {message1 && (
              <div className="text-sm text-green-600 text-center bg-green-50 p-2 rounded-md">{message1}</div>
            )}
            <div className="flex gap-2 pt-2">
              <>
                {
                  subscription?.cancelAtPeriodEnd === false ?
                    (
                      <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm" onClick={checkSpecialOffer}>
                        Cancel Subscription
                      </button>) :
                    null

                }
              </>

              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm" onClick={handleChangePaymentCard}>
                Change card details
              </button>
              {subscription?.status === "canceled" && <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm" onClick={handleRenewSubscription}>
                Renew Subscription
              </button>}
            </div>
          </div>
        </div>
        <div className="w-full max-w-lg mx-auto lg:mx-0 lg:max-w-md rounded-lg border border-gray-200 bg-white p-4 sm:p-6 lg:p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div
              className="relative h-12 w-12 rounded-full bg-gray-200 cursor-pointer overflow-hidden "
              onClick={() => fileInputRef.current?.click()}
            >
              {(previewUrl || logoUrl) ? (
                <Image
                  src={previewUrl || logoUrl || ""}
                  alt="Business logo"
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    console.error('Error loading logo:', e);
                    setThemeError('Failed to load logo');
                    setLogoUrl(null);
                    localStorage.removeItem('businessLogo');
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept=".png"
                className="hidden"
              />
            </div>
            <div>
              <div className="text-sm font-medium">Change Logo (.png)</div>
              {isLoading && <div className="text-xs text-gray-500">Uploading...</div>}
              {previewUrl && !isLoading && <div className="text-xs text-gray-500">Preview</div>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2 mt-6">
                <div className="h-10 w-10 shrink-0 rounded-md border" style={{ backgroundColor: selectedColor || '#ffffff' }} />
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={handleHexChange}
                  className="flex-1"
                  placeholder="#000000"
                />
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                  className="h-10 w-10 shrink-0 rounded-md border flex items-center justify-center"
                >
                  {isPickerOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              {isPickerOpen && (
                <div className="relative mt-2 rounded-md border p-4">
                  {/* Main color gradient */}
                  <div
                    ref={gradientRef}
                    className="relative h-32 w-full cursor-pointer rounded-md"
                    style={{
                      background: `linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(0,0,0,1) 100%), 
                                  linear-gradient(to right, rgba(128,128,128,1) 0%, hsl(${huePos * 360}, 100%, 50%) 100%)`,
                      backgroundBlendMode: "multiply",
                    }}
                    onClick={handleGradientClick}
                  >
                    {/* Selector circle */}
                    <div
                      className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                      style={{
                        left: `${gradientPos.x * 100}%`,
                        top: `${gradientPos.y * 100}%`,
                        backgroundColor: selectedColor || '#ffffff',
                      }}
                    />
                  </div>

                  {/* Hue slider */}
                  <div
                    ref={hueSliderRef}
                    className="relative h-6 mt-2 cursor-pointer rounded-md"
                    style={{
                      background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                    }}
                    onClick={handleHueClick}
                  >
                    {/* Hue selector */}
                    <div
                      className="absolute top-0 h-full w-1 -translate-x-1/2 border-2 border-white"
                      style={{ left: `${huePos * 100}%` }}
                    />
                  </div>

                  {/* RGB inputs */}
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="text-xs font-medium">HEX</div>
                      <Input value={selectedColor.replace("#", "")} onChange={handleHexChange} className="mt-1 text-center h-8" placeholder="000000" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">R</div>
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={r}
                        onChange={(e) => handleRgbChange("r", e.target.value)}
                        className="mt-1 text-center h-8"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">G</div>
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={g}
                        onChange={(e) => handleRgbChange("g", e.target.value)}
                        className="mt-1 text-center h-8"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-medium">B</div>
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={b}
                        onChange={(e) => handleRgbChange("b", e.target.value)}
                        className="mt-1 text-center h-8"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {themeError && (
            <div className="text-sm text-red-600 text-center">{themeError}</div>
          )}
          {message && (
            <div className="text-sm text-green-600 text-center">{message}</div>
          )}
          <div className="flex gap-2 pt-2 mt-4">
            <button
              onClick={handleResetTheme}
              disabled={isLoading}
              className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading || !hasChanges}
              className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      {showSpecialOffer && !showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-12 w-full max-w-md sm:max-w-lg mx-4 min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-6 relative">
                <h3 className="text-xl font-semibold flex-1">
                  {specialOfferReason === "already_used" ? "Cancel Subscription" : "Special Offer"}
                </h3>
                <button
                  className="absolute right-0 top-1 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowSpecialOffer(false)}
                  style={{ lineHeight: 0 }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{specialOfferMessage}</p>
            </div>
            <div className="flex justify-end mt-4">
              {specialOfferReason === "already_used" ? (
                <button
                  onClick={handleDeclineSpecialOffer}
                  className="w-full px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
                >
                  I want to cancel my subscription
                </button>
              ) : (
                <>
                  <button
                    onClick={handleDeclineSpecialOffer}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    I want to cancel my subscription
                  </button>
                  <button
                    onClick={handleAcceptSpecialOffer}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Yes, I accept the offer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md sm:max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Details</h3>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => {
                setShowPaymentForm(false);
                setIsPaymentFormForChangeCard(false);
              }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm
                onPaymentMethodCreated={isPaymentFormForChangeCard ? handlePaymentMethodCreatedForChange : handlePaymentMethodCreated}
                isForChangeCard={isPaymentFormForChangeCard}
              />
            </Elements>
          </div>
        </div>
      )}
      {showRenewSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold mb-4">Renew Subscription</h3>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setShowRenewSubscription(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm onPaymentMethodCreated={handleRenewSubscriptionAPI} />
            </Elements>
          </div>
        </div>
      )}
      {showRenewSavedCards && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Payment Method</h3>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => {
                setShowRenewSavedCards(false);
                setSelectedCard(null);
              }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedCard === card.id ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        {card.brand === 'visa' && (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M22.4 4.4H1.6C.7 4.4 0 5.1 0 6v12c0 .9.7 1.6 1.6 1.6h20.8c.9 0 1.6-.7 1.6-1.6V6c0-.9-.7-1.6-1.6-1.6z" fill="#1A1F71" />
                          </svg>
                        )}
                        {card.brand === 'mastercard' && (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4.4c-4.2 0-7.6 3.4-7.6 7.6s3.4 7.6 7.6 7.6 7.6-3.4 7.6-7.6-3.4-7.6-7.6-7.6z" fill="#EB001B" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{card.brand.charAt(0).toUpperCase() + card.brand.slice(1)}</div>
                        <div className="text-sm text-gray-500">**** **** **** {card.last4}</div>
                      </div>
                    </div>
                    {selectedCard === card.id && (
                      <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-black"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  if (selectedCard) {
                    setShowRenewSavedCards(false);
                    handleRenewSubscriptionAPI(selectedCard);
                  }
                }}
                disabled={!selectedCard}
                className="w-full py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue with Selected Card
              </button>
            </div>
          </div>
        </div>
      )}
      {showNoSubscriptionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">No Active Subscription</h3>
              <p className="text-gray-600 mb-6">
                You need an active subscription to access this feature. Please subscribe to continue using our platform.
              </p>
              <button
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    window.location.href = '/signin';
                  } else {
                    // Clear the dashboard lock cookie
                    document.cookie = "dashboardLock=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    setShowNoSubscriptionPopup(false);
                    window.location.href = '/payment/currencySelection';
                  }
                }}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Subscribe Now
              </button>
              <button
                className="ml-5 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => handleLogout()}>Logout</button>
            </div>
          </div>
        </div>
      )}
      {showPausedSubscriptionPopup && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">No Active Subscription</h3>
            <p className="text-gray-600 mb-6">
              Your subscription is paused. Please contact admin.
            </p>
          </div>
        </div>
      </div>}
      {showSavedCards && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Payment Method</h3>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => {
                setShowSavedCards(false);
                setSelectedCard(null);
              }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedCard === card.id ? 'border-black bg-gray-50' : 'border-gray-200'
                    }`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        {card.brand === 'visa' && (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M22.4 4.4H1.6C.7 4.4 0 5.1 0 6v12c0 .9.7 1.6 1.6 1.6h20.8c.9 0 1.6-.7 1.6-1.6V6c0-.9-.7-1.6-1.6-1.6z" fill="#1A1F71" />
                          </svg>
                        )}
                        {card.brand === 'mastercard' && (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4.4c-4.2 0-7.6 3.4-7.6 7.6s3.4 7.6 7.6 7.6 7.6-3.4 7.6-7.6-3.4-7.6-7.6-7.6z" fill="#EB001B" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{card.brand.charAt(0).toUpperCase() + card.brand.slice(1)}</div>
                        <div className="text-sm text-gray-500">**** **** **** {card.last4}</div>
                      </div>
                    </div>
                    {selectedCard === card.id && (
                      <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-black"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  if (selectedCard) {
                    setShowSavedCards(false);
                    handlePaymentMethodCreated(selectedCard);
                  }
                }}
                disabled={!selectedCard}
                className="w-full py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue with Selected Card
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
