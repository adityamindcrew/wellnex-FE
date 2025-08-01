"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Eye, Pencil, Trash2, Plus, Check, X } from "lucide-react"

type Keyword = {
  id: string
  name: string
  createdAt: string
  active: boolean
  checked: boolean
}

export default function BusinessKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [keywordToDelete, setKeywordToDelete] = useState<string | null>(null)
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [showAddInput, setShowAddInput] = useState(false)
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [inputWidth, setInputWidth] = useState(200);

  const fetchKeywords = async () => {
    try {
      const token = localStorage.getItem('token')
      const businessId = localStorage.getItem('businessId')
      
      const response = await fetch('https://wellnexai.com/api/business/getKeywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId: businessId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch keywords')
      }
      
      const responseData = await response.json()
      
      if (!responseData.status || responseData.code !== 200) {
        throw new Error(responseData.message || 'Failed to fetch keywords')
      }

      const keywordsData = responseData.data
      
      if (!Array.isArray(keywordsData)) {
        throw new Error('Invalid response format: expected an array of keywords')
      }

      const transformedKeywords = keywordsData.map((keyword: any) => ({
        id: keyword._id,
        name: keyword.name,
        createdAt: new Date(keyword.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        active: true,
        checked: false
      }))
      setKeywords(transformedKeywords)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchKeywords()
  }, [])

  // Automatically clear error after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (editingKeyword && measureRef.current) {
      setInputWidth(measureRef.current.offsetWidth + 24); // 24px for padding/border
    }
  }, [editValue, editingKeyword]);

  const handleDeleteClick = (keywordId: string) => {
    setKeywordToDelete(keywordId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!keywordToDelete) return
    
    try {
      setIsDeleting(true)
      const token = localStorage.getItem('token')
      const businessId = localStorage.getItem('businessId')

      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch('https://wellnexai.com/api/business/deleteKeyword', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({
          keywordId: keywordToDelete,
          businessId: businessId
        })
      })

      const responseText = await response.text()
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!responseData.status || responseData.code !== 200) {
        throw new Error(responseData.message || 'Failed to delete keyword')
      }

      await fetchKeywords()
      setShowDeleteModal(false)
      setKeywordToDelete(null)
    } catch (err) {
      console.error('Delete error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete keyword')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setKeywordToDelete(null)
  }

  const handleEditClick = (keyword: Keyword) => {
    setEditingKeyword(keyword.id)
    setEditValue(keyword.name)
  }

  const handleUpdateKeyword = async () => {
    if (!editingKeyword || !editValue.trim()) return

    try {
      setIsUpdating(true)
      const token = localStorage.getItem('token')
      const businessId = localStorage.getItem('businessId')

      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch('https://wellnexai.com/api/business/updateOneKeyword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({
          keywords: {
            _id: editingKeyword,
            name: editValue.trim()
          },
          businessId: businessId
        })
      })

      const responseText = await response.text()
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }

      if (!responseData.status || responseData.code !== 200) {
        throw new Error(responseData.message || 'Failed to update keyword')
      }

      await fetchKeywords()
      setEditingKeyword(null)
      setEditValue("")
    } catch (err) {
      console.error('Update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update keyword')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingKeyword(null)
    setEditValue("")
  }

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;

    // Check for duplicate in local state before API call
    if (keywords.some(k => k.name.toLowerCase() === newKeyword.trim().toLowerCase())) {
      setError('Keyword already exists');
      setNewKeyword(""); // Clear the input field on duplicate
      return;
    }

    try {
      setIsAdding(true);
      setError(null);
      const token = localStorage.getItem('token');
      const businessId = localStorage.getItem('businessId');

      if (!token || !businessId) {
        throw new Error('Authentication token or business ID not found');
      }

      const response = await fetch('https://wellnexai.com/api/business/addBusinessKeywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({
          keywords: [{ name: newKeyword.trim() }],
          businessId: businessId,
          replace: false
        })
      });

      const responseData = await response.json();

      if (!responseData.status || responseData.code !== 200) {
        setError(responseData.message || 'Keyword already exists');
        return;
      }

      await fetchKeywords();
      setNewKeyword("");
      setShowAddInput(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Keyword already exists');
      // Do not clear input or hide add input on error
    } finally {
      setIsAdding(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white">
        {error && (
          <div className="text-center text-red-600 py-2">
            {error}
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4 gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Business Keywords</h2>
            <div className="rounded-full bg-black px-3 py-1 text-xs text-white w-fit">{keywords.length} Keywords</div>
          </div>
          <div className="flex items-center gap-2">
            {keywords.length < 10 && (
              !showAddInput ? (
                <button 
                  onClick={() => setShowAddInput(true)}
                  className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm text-white"
                >
                  <Plus size={16} />
                  <span>Add Keyword</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Enter keyword"
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#987CF1] pr-8"
                      disabled={isAdding}
                    />
                    <button
                      onClick={() => {
                        setShowAddInput(false)
                        setNewKeyword("")
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddKeyword}
                    disabled={isAdding || !newKeyword.trim()}
                    className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
                  >
                    <Plus size={16} />
                    {isAdding ? 'Adding...' : 'Add keyword'}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
        <div className="px-4 sm:px-6 py-2">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] items-center border-b border-gray-100 py-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6"></div>
              <div className="flex items-center gap-1 font-medium">
                Keywords
              </div>
            </div>
            <div className="w-32 font-medium text-right sm:text-left">Last Edited</div>
            <div className="w-20 font-medium text-right sm:text-left">Status</div>
            <div className="w-24"></div>
          </div>
          {keywords.map((keyword) => (
            <div 
              key={keyword.id} 
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] items-center border-b border-gray-100 py-3 text-sm gap-2 sm:gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center">
                  {/* checkbox placeholder */}
                </div>
                {editingKeyword === keyword.id ? (
                  <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0">
                    <span
                      ref={measureRef}
                      className="invisible absolute whitespace-pre px-2 py-1 border border-transparent text-base font-normal"
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                        letterSpacing: 'inherit'
                      }}
                      aria-hidden="true"
                    >
                      {editValue || keyword.name}
                    </span>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#987CF1] overflow-x-auto whitespace-nowrap"
                      style={{
                        width: `${Math.max(inputWidth, 100)}px`,
                        minWidth: '100px',
                        maxWidth: '100%'
                      }}
                      disabled={isUpdating}
                    />
                    <div className="flex gap-2 sm:gap-2">
                      <button
                        onClick={handleUpdateKeyword}
                        disabled={isUpdating}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0 break-words whitespace-normal">{keyword.name}</div>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-start">
                <span className="sm:hidden text-gray-500">Last Edited:</span>
                <div className="w-32 text-gray-500">{keyword.createdAt}</div>
              </div>
              <div className="flex items-center justify-between sm:justify-start">
                <span className="sm:hidden text-gray-500">Status:</span>
                <div className="w-20">
                  {keyword.active && (
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span className="text-green-600">Active</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleEditClick(keyword)}
                  disabled={isUpdating}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <Pencil size={18} className="text-gray-500" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(keyword.id)}
                  disabled={isDeleting || isUpdating}
                  className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Trash2 size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Keyword</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this keyword? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
