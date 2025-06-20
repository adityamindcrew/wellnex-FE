"use client"

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Image from 'next/image'
import logo from '../../assets/images/logo.png'
import { businessApi } from '../../services/api'
import { use } from 'react'

function VerifyEmailContent({ params }: { params: Promise<{ businessId: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')
  const { businessId } = use(params)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (typeof window !== "undefined") {
          // Get token from URL hash if present
          const hash = window.location.hash
          let token = searchParams.get('token')

          if (!token && hash) {
            const hashParams = new URLSearchParams(hash.split('?')[1])
            token = hashParams.get('token')
          }

          if (!token) {
            throw new Error('No verification token found')
          }

      
          const response = await businessApi.verifyEmailByLink(businessId, token);

          if (response.status) {
            setVerificationStatus('success')
            setMessage('Email verified successfully! Closing window...')

            // Set the token in localStorage and cookies
            if (response.token) {
              localStorage.setItem('token', response.token)
              document.cookie = `token=${response.token}; path=/`
              document.cookie = `authorization=Bearer ${response.token}; path=/`
            }

            // Close window after 1 second
            setTimeout(() => {
              window.close()
              // Fallback to redirect if window.close() doesn't work
              router.push('/dashboard')
            }, 1000)
          } else {
            throw new Error(response.message || 'Verification failed')
          }
        }
      } catch (error) {
        setVerificationStatus('error')
        setMessage(error instanceof Error ? error.message : 'Verification failed')
      }
    }

    verifyEmail()
  }, [businessId, searchParams, router])

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] flex justify-center items-center">
      <div className="w-full max-w-[500px] bg-white shadow-lg rounded-2xl p-8 mx-4">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <Image src={logo} alt="WellnexAI Logo" width={100} height={200} />
          </div>

          <div className="text-center">
            {verificationStatus === 'loading' && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#987CF1] mx-auto mb-4"></div>
            )}

            {verificationStatus === 'success' && (
              <div className="text-green-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            )}

            <h1 className="text-2xl font-bold mb-4">
              {verificationStatus === 'loading' && 'Verifying Email'}
              {verificationStatus === 'success' && 'Email Verified'}
              {verificationStatus === 'error' && 'Verification Failed'}
            </h1>

            <p className="text-gray-600 mb-6">{message}</p>

            {verificationStatus === 'error' && (
              <button
                onClick={() => router.push('/signin')}
                className="px-6 py-2 bg-[#987CF1] text-white rounded-lg hover:bg-[#7a63c7] transition-colors"
              >
                Go to plan selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default function VerifyEmail({ params }: { params: Promise<{ businessId: string }> }) {
  return (
    <Suspense>
      <VerifyEmailContent params={params} />
    </Suspense>
  )
} 