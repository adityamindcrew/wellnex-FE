"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Currency {
  _id: string
  code: string
  name: string
  symbol: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  code: number
  status: boolean
  message: string
  data: Currency[]
}

export default function CurrencySelectionPage() {
  const router = useRouter()
  const [selectedCurrency, setSelectedCurrency] = useState<string>('')
  const [hasCurrency, setHasCurrency] = useState(false)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Check if there's a saved currency in localStorage
    const savedCurrency = localStorage.getItem('currency')
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency)
      setHasCurrency(true)
    }

    // Fetch currencies from Wellnex API
    const fetchCurrencies = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required. Please login first.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`http://13.61.105.209/api/currency/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please login again.')
            return
          }
          if (response.status === 403) {
            setError('You do not have permission to access this resource.')
            return
          }
          throw new Error(`Failed to fetch currencies: ${response.statusText}`)
        }

        const data: ApiResponse = await response.json()
        
        if (!data.status) {
          throw new Error(data.message || 'Failed to fetch currencies')
        }

        if (!Array.isArray(data.data)) {
          throw new Error('Invalid response format from server')
        }

        // Filter only active currencies
        const activeCurrencies = data.data.filter(currency => currency.isActive)

        if (activeCurrencies.length === 0) {
          throw new Error('No active currencies found')
        }

        setCurrencies(activeCurrencies)
        setError(null)

        // If there's a default currency and no currency is selected, select it
        const defaultCurrency = activeCurrencies.find(c => c.isDefault)
        if (defaultCurrency && !selectedCurrency) {
          setSelectedCurrency(defaultCurrency.code)
          setHasCurrency(true)
          localStorage.setItem('currency', defaultCurrency.code)
        }
      } catch (err) {
        console.error('Error fetching currencies:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch currencies')
        // Fallback to common currencies
        setCurrencies([
          { 
            _id: 'fallback-usd',
            code: 'USD', 
            name: 'US Dollar', 
            symbol: '$',
            isActive: true,
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          { 
            _id: 'fallback-eur',
            code: 'EUR', 
            name: 'Euro', 
            symbol: '€',
            isActive: true,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          { 
            _id: 'fallback-gbp',
            code: 'GBP', 
            name: 'British Pound', 
            symbol: '£',
            isActive: true,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          { 
            _id: 'fallback-inr',
            code: 'INR', 
            name: 'Indian Rupee', 
            symbol: '₹',
            isActive: true,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrencies()
  }, [selectedCurrency])

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value
    setSelectedCurrency(currency)
    setHasCurrency(!!currency)
    localStorage.setItem('currency', currency)
  }

  const handleSave = async () => {
    if (!selectedCurrency) {
      return
    }

    const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency)
    if (!selectedCurrencyData) {
      setError('Invalid currency selection')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`http://13.61.105.209/api/subscription/update-preferred-currency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currencyId: selectedCurrencyData._id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update currency')
      }

      const data = await response.json()
      
      // Check if the response contains an error message
      if (data.message && data.message.toLowerCase().includes('error')) {
        throw new Error(data.message)
      }

      // If we get here, the update was successful
      localStorage.setItem('currency', selectedCurrency)
      router.push('/payment/planSelection')
    } catch (err) {
      console.error('Error updating currency:', err)
      setError(err instanceof Error ? err.message : 'Failed to update currency')
    } finally {
      setIsSaving(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Error</h2>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#987CF1] text-white rounded-lg hover:bg-[#8769E0]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Select Your Currency</h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose the currency you'll use for your business transactions
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              disabled={isLoading || isSaving}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#987CF1] focus:border-transparent appearance-none bg-white disabled:bg-gray-100"
            >
              <option value="">Select a currency</option>
              {currencies.map((currency) => (
                <option key={currency._id} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            {/* <button
              onClick={() => router.back()}
              disabled={isSaving}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button> */}
            <button
              onClick={handleSave}
              disabled={!selectedCurrency || isLoading || isSaving}
              className="px-4 py-2 bg-[#987CF1] text-white rounded-lg hover:bg-[#8769E0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
