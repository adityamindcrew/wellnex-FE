"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { businessApi } from "@/app/services/api"

export default function VerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const businessId = searchParams.get('businessId')
        const token = searchParams.get('token')

        if (!businessId || !token) {
          setVerificationStatus('error')
          setMessage('Invalid verification link')
          return
        }

        const response = await businessApi.verifyEmailByLink(businessId, token)
        
        if (response.status) {
          setVerificationStatus('success')
          setMessage('Email verified successfully!')
          // Redirect to signin after 3 seconds
          setTimeout(() => {
            router.push('/signin')
          }, 3000)
        } else {
          setVerificationStatus('error')
          setMessage(response.message || 'Verification failed')
        }
      } catch (error) {
        setVerificationStatus('error')
        setMessage('Error verifying email')
        console.error('Verification error:', error)
      }
    }

    verifyEmail()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <div className="mt-4">
            {verificationStatus === 'loading' && (
              <div className="text-gray-600">Verifying your email...</div>
            )}
            {verificationStatus === 'success' && (
              <div className="text-green-600">{message}</div>
            )}
            {verificationStatus === 'error' && (
              <div className="text-red-600">{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 