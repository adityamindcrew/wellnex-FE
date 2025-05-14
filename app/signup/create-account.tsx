"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Info, Eye, EyeOff } from "lucide-react"
import loginImage from '../assets/images/login.png';
import logo from '../assets/images/logo.png';
import { businessApi, BusinessSignupData } from '../services/api';
import { useRouter } from 'next/navigation';

export default function CreateAccount() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    businessEmail: "",
    password: "",
    websiteUrl: "",
    instagram: "",
    contactName: "",
  })

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // useEffect(() => {
  //   const onboardingStep = localStorage.getItem("onboardingStep");
  //   if (onboardingStep && ["1","2","3","4"].includes(onboardingStep)) {
  //     router.replace(`/onboarding/step-${onboardingStep}`);
  //   }
  // }, [router]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    if (name === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordError) {
      setError("Please fix password validation errors");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const signupData: BusinessSignupData = {
        email: formData.businessEmail,
        password: formData.password,
        name: formData.businessName,
        contact_name: formData.contactName,
        website_url: formData.websiteUrl || undefined,
        instagram_url: formData.instagram || undefined,
      };

      const response = await businessApi.signup(signupData);
      console.log("Signup successful:", response);
      
      // Store businessId and token in localStorage
      if (response.data && response.data._id && response.data.loginToken) {
        localStorage.setItem('businessId', response.data._id);
        localStorage.setItem('token', response.data.loginToken);
      } else {
        throw new Error('Invalid response format from server');
      }
   
      router.push('/onboarding/step-1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex justify-center">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-[900px] bg-white shadow-lg rounded-2xl mx-auto">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-8 py-8 h-full">
          {/* Centered logo and headings */}
          <div className="mb-8 ">
            <div className="mb-4">
              <Image src={logo} alt="WellnexAI Logo" width={100} height={200} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Create Account</h1>
            <p className="text-gray-500 text-base mb-2 text-center">Start by telling us about your business.</p>
          </div>
          {/* Left-aligned error and form */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base"
              />
            </div>
            <div className="relative">
              <input
                type="email"
                name="businessEmail"
                placeholder="Business Email"
                value={formData.businessEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Info className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <input
                type="url"
                name="websiteUrl"
                placeholder="Website URL (Optional)"
                value={formData.websiteUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base"
              />
            </div>
            <div>
              <input
                type="text"
                name="instagram"
                placeholder="Instagram (Optional)"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base"
              />
            </div>
            <div>
              <input
                type="text"
                name="contactName"
                placeholder="Contact Name"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-[#FAFAFA] text-base pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {passwordError && (
                <p className="mt-1 text-xs text-red-600">{passwordError}</p>
              )}
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-[rgba(152,124,241,0.5)] border border-[#000000] text-[#000000] font-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-sm"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
        {/* Right: Image */}
        <div className="w-full md:w-1/2 flex items-stretch justify-center p-0 m-0">
          <div className="relative w-full min-h-[300px] md:min-h-0 md:h-auto aspect-square md:aspect-auto overflow-hidden flex items-stretch justify-center p-0 m-0">
            <Image
              src={loginImage}
              alt="WellnexAI illustration"
              fill
              className="object-cover h-full w-full"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
