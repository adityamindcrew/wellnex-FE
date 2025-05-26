'use client'
import { useState, useRef, useEffect } from "react";
import { businessApi } from "../../app/services/api";
import Image from "next/image";
import { ImageIcon, ChevronDown, ChevronUp, PipetteIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PlatformSubscription() {
  const [selectedColor, setSelectedColor] = useState("#987CF1");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSpecialOffer, setShowSpecialOffer] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
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

  // Load logo and theme color from localStorage on component mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('businessLogo');
    const savedPreview = localStorage.getItem('logoPreview');
    const savedColor = localStorage.getItem('themeColor');

    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
    if (savedPreview) {
      setPreviewUrl(savedPreview);
    }
    if (savedColor) {
      setSelectedColor(savedColor);
      setInitialColor(savedColor);
    }

    // Fetch subscription status
    const fetchSubscription = async () => {
      setSubscriptionLoading(true);
      try {
        const token = localStorage.getItem('token');
        const businessId = localStorage.getItem('businessId');
        if (!token || !businessId) {
          setSubscriptionLoading(false);
          return;
        }
        const response = await fetch('https://wellnexai.com/api/subscription/status?businessId=' + businessId, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
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
    setError(null);

    if (!file) return;

    // Check if file is PNG
    if (!file.type.includes("png")) {
      setError("Please upload a PNG file only");
      return;
    }

    // Show preview immediately and store in localStorage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setPreviewUrl(base64String);
      localStorage.setItem('logoPreview', base64String);
      setSelectedFile(file);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
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
      setError(null);
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

          const response = await fetch('https://wellnexai.com/api/business/uploadBusinessLogo', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload logo');
          }

          // Save the preview URL as the logo URL
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
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual hex input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`
    if (value.match(/^#([0-9A-F]{3}){1,2}$/i) || value === "#") {
      setSelectedColor(value)
      setError(null)
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
    setError(null)
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
    setError(null)
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
    setError(null)
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
    const defaultColor = "#987CF1";
    setSelectedColor(defaultColor);
    setInitialColor(defaultColor);
    localStorage.removeItem('logoPreview'); // Clear logo preview from localStorage
    setPreviewUrl(null);
    setSelectedFile(null);
    setHasChanges(true);
  };

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
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <div className="w-[400px] rounded-lg border border-gray-200 bg-white p-6 lg:p-4">
          <div className="space-y-4">
            {subscriptionLoading ? (
              <div className="text-center text-gray-500 py-4">Loading subscription...</div>
            ) : subscription ? (
              <>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">Subscription Status</div>
                  <div className="text-sm font-medium">{subscription.status || 'N/A'}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">Start Date</div>
                  <div className="text-sm">{subscription.currentPeriodStart ? subscription.currentPeriodStart.slice(0, 10) : 'N/A'}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">Next Renewal Date</div>
                  <div className="text-sm">
                    {subscription.currentPeriodEnd ? subscription.currentPeriodEnd.slice(0, 10) : 'N/A'}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-sm">{subscription.email || 'N/A'}</div>
                </div>
              </>
            ) : (
              <div className="text-center text-red-500 py-4">No subscription data found.</div>
            )}
            <div className="flex gap-2 pt-2">
              <button className="rounded-md bg-black px-4 py-2 text-sm text-white">Renew Now</button>
              <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
        <div className="w-[400px] rounded-lg border border-gray-200 bg-white p-6 lg:p-4">
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
                    setError('Failed to load logo');
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
          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}
          {message && (
            <div className="text-sm text-green-600 text-center">{message}</div>
          )}
          <div className="flex gap-2 pt-2  mt-4">
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
