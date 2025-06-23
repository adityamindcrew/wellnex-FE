"use client"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, Eye, Pencil, Trash2, Plus, Check, X } from "lucide-react"

type Service = {
  id: string
  name: string
  createdAt: string
  active: boolean
  checked: boolean
}

export default function BusinessServices() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [newService, setNewService] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [showAddInput, setShowAddInput] = useState(false)
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [inputWidth, setInputWidth] = useState(200);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const businessId = localStorage.getItem('businessId');
      
      const response = await fetch('https://wellnexai.com/api/business/getServicesList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId: businessId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const responseData = await response.json();
      
      if (!responseData.status || responseData.code !== 200) {
        throw new Error(responseData.message || 'Failed to fetch services');
      }

      const servicesData = responseData.data;
      
      if (!Array.isArray(servicesData)) {
        throw new Error('Invalid response format: expected an array of services');
      }

      const transformedServices = servicesData.map((service) => ({
        id: service._id,
        name: service.name,
        createdAt: new Date(service.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        active: true,
        checked: false
      }));
      setServices(transformedServices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Do NOT clear the services list here!
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Automatically clear error after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (editingService && measureRef.current) {
      setInputWidth(measureRef.current.offsetWidth + 24); // 24px for padding/border
    }
  }, [editValue, editingService]);

  const handleDeleteClick = (serviceId: string) => {
    setServiceToDelete(serviceId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return
    
    try {
      setIsDeleting(true)
      const token = localStorage.getItem('token')
      const businessId = localStorage.getItem('businessId')

      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch('https://wellnexai.com/api/business/deleteService', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId: serviceToDelete,
          businessId: businessId
        })
      })

      const responseData = await response.json()

      if (!responseData.status || responseData.code !== 200) {
        throw new Error(responseData.message || 'Failed to delete service')
      }

      await fetchServices()
      setShowDeleteModal(false)
      setServiceToDelete(null)
    } catch (err) {
      console.error('Delete error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete service')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setServiceToDelete(null)
  }

  const handleEditClick = (service: Service) => {
    setEditingService(service.id)
    setEditValue(service.name)
  }

  const handleUpdateService = async () => {
    if (!editingService || !editValue.trim()) return

    try {
      setIsUpdating(true)
      const token = localStorage.getItem('token')
      const businessId = localStorage.getItem('businessId')

      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch('https://wellnexai.com/api/business/updateOneService', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({
          businessId: businessId,
          service: {
            _id: editingService,
            name: editValue.trim()
          }
        })
      })

      const responseData = await response.json()

      if (!responseData.status || responseData.code !== 200) {
        throw new Error(responseData.message || 'Failed to update service')
      }

      await fetchServices()
      setEditingService(null)
      setEditValue("")
    } catch (err) {
      console.error('Update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update service')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingService(null)
    setEditValue("")
  }

  const handleAddService = async () => {
    if (!newService.trim()) return

    // Check for duplicate in local state before API call
    if (services.some(s => s.name.toLowerCase() === newService.trim().toLowerCase())) {
      setError('Service already exists');
      setNewService("");
      return;
    }

    try {
      setIsAdding(true)
      setError(null)
      const token = localStorage.getItem('token')
      const businessId = localStorage.getItem('businessId')

      if (!token || !businessId) {
        throw new Error('Authentication token or business ID not found')
      }

      const response = await fetch('https://wellnexai.com/api/business/addBusinessServices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId: businessId,
          services: [
            {
              name: newService.trim()
            }
          ]
        })
      })

      const responseData = await response.json()

      if (!responseData.status || responseData.code !== 200) {
        setError(responseData.message || 'Service already exists');
        return;
      }

      // Only on success:
      await fetchServices()
      setNewService("")
      setShowAddInput(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Service already exists')
      // Do not clear input or hide add input on error
    } finally {
      setIsAdding(false)
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
            <h2 className="text-xl font-semibold">Business Services</h2>
            <div className="rounded-full bg-black px-3 py-1 text-xs text-white w-fit">{services.length} Services</div>
          </div>
          <div className="flex items-center gap-2">
            {!showAddInput ? (
              <button 
                onClick={() => setShowAddInput(true)}
                className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm text-white"
              >
                <Plus size={16} />
                <span>Add Service</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Enter service name"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#987CF1] pr-8"
                    disabled={isAdding}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isAdding && newService.trim()) {
                        handleAddService()
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      setShowAddInput(false)
                      setNewService("")
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <button
                  onClick={handleAddService}
                  disabled={isAdding || !newService.trim()}
                  className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
                >
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="px-4 sm:px-6 py-2">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] items-center border-b border-gray-100 py-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-6"></div>
              <div className="flex items-center gap-1 font-medium">
                Services
              </div>
            </div>
            <div className="w-32 font-medium text-right sm:text-left">Last Edited</div>
            <div className="w-20 font-medium text-right sm:text-left">Status</div>
            <div className="w-24"></div>
          </div>
          {services.map((service) => (
            <div 
              key={service.id} 
              className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] items-center border-b border-gray-100 py-3 text-sm gap-2 sm:gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center">
                  {/* checkbox placeholder */}
                </div>
                {editingService === service.id ? (
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
                      {editValue || service.name}
                    </span>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#987CF1]"
                      style={{
                        width: `${Math.max(inputWidth, 100)}px`,
                        minWidth: '100px',
                        maxWidth: '100%'
                      }}
                      disabled={isUpdating}
                    />
                    <div className="flex gap-2 sm:gap-2">
                      <button
                        onClick={handleUpdateService}
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
                  <div className="flex-1 min-w-0 break-words whitespace-normal">{service.name}</div>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-start">
                <span className="sm:hidden text-gray-500">Last Edited:</span>
                <div className="w-32 text-gray-500">{service.createdAt}</div>
              </div>
              <div className="flex items-center justify-between sm:justify-start">
                <span className="sm:hidden text-gray-500">Status:</span>
                <div className="w-20">
                  {service.active && (
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span className="text-green-600">Active</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => handleEditClick(service)}
                  disabled={isUpdating}
                  className="rounded-full p-1 hover:bg-gray-100"
                >
                  <Pencil size={18} className="text-gray-500" />
                </button>
                <button 
                  onClick={() => handleDeleteClick(service.id)}
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
            <h3 className="text-lg font-semibold mb-4">Delete Service</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this service? This action cannot be undone.</p>
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