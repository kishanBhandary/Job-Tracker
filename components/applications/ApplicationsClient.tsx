'use client'

import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Plus, Search } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { ApplicationTable } from './ApplicationTable'
import { ApplicationCard } from './ApplicationCard'
import { DeleteDialog } from './DeleteDialog'
import { ApplicationForm } from './ApplicationForm'
import { 
  getJobApplications, 
  createJobApplication, 
  updateJobApplication, 
  deleteJobApplication 
} from '@/lib/actions'
import { useRouter, useSearchParams } from 'next/navigation'

interface ApplicationsClientProps {
  initialApplications: any[]
}

export function ApplicationsClient({ initialApplications }: ApplicationsClientProps) {
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('q') || ''

  const [applications, setApplications] = useState(initialApplications)
  const [search, setSearch] = useState(urlQuery)
  const [status, setStatus] = useState('All')
  const [sortBy, setSortBy] = useState<'Newest' | 'Oldest'>('Newest')
  
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState('')
  const router = useRouter()

  useEffect(() => {
    setSearch(urlQuery)
  }, [urlQuery])

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  
  // State variables for submit loaders
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch applications when filters change
  const fetchFilteredApplications = useCallback(async (searchVal: string, statusVal: string, sortVal: 'Newest' | 'Oldest') => {
    setIsLoading(true)
    try {
      const res = await getJobApplications({
        search: searchVal,
        status: statusVal,
        sortBy: sortVal
      })
      if (res.success && res.applications) {
        setApplications(res.applications)
      }
    } catch (error) {
      console.error('Failed to search applications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFilteredApplications(search, status, sortBy)
    }, 300) // 300ms debounce for typing search

    return () => clearTimeout(delayDebounce)
  }, [search, status, sortBy, fetchFilteredApplications])

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 4000)
  }

  // Create Application Action
  const handleAddSubmit = async (formData: any) => {
    const res = await createJobApplication(formData)
    if (res.success) {
      showNotification('Application added successfully.')
      setIsAddOpen(false)
      fetchFilteredApplications(search, status, sortBy)
      router.refresh()
      return { success: true }
    }
    return { success: false, error: res.error, validationErrors: res.validationErrors }
  }

  // Update Application Action
  const handleEditSubmit = async (formData: any) => {
    if (!selectedApp) return { success: false, error: 'No application selected' }
    
    const res = await updateJobApplication(selectedApp.id, formData)
    if (res.success) {
      showNotification('Application updated successfully.')
      setIsEditOpen(false)
      fetchFilteredApplications(search, status, sortBy)
      router.refresh()
      return { success: true }
    }
    return { success: false, error: res.error, validationErrors: res.validationErrors }
  }

  // Delete Application Action
  const handleDeleteConfirm = async () => {
    if (!selectedApp) return
    setIsDeleting(true)
    try {
      const res = await deleteJobApplication(selectedApp.id)
      if (res.success) {
        showNotification('Application deleted successfully.')
        setIsDeleteOpen(false)
        fetchFilteredApplications(search, status, sortBy)
        router.refresh()
      } else {
        alert(res.error || 'Failed to delete application.')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Open edit modal helper
  const triggerEdit = (app: any) => {
    setSelectedApp(app)
    setIsEditOpen(true)
  }

  // Open delete dialog helper
  const triggerDelete = (id: string, companyName: string) => {
    setSelectedApp({ id, companyName })
    setIsDeleteOpen(true)
  }

  const statusFilterOptions = [
    { value: 'All', label: 'AllStatuses' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Screening', label: 'Screening' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Offer', label: 'Offer' },
    { value: 'Rejected', label: 'Rejected' },
  ]

  const sortOptions = [
    { value: 'Newest', label: 'Newest' },
    { value: 'Oldest', label: 'Oldest' },
  ]

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Success Notification */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-250/30 text-emerald-800 text-xs font-semibold rounded-lg shadow-sm">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-neutral-955 tracking-tight leading-none">Applications</h2>
          <p className="text-xs font-semibold text-neutral-450 mt-2">Track and manage every job opportunity.</p>
        </div>
        
        <button 
          onClick={() => setIsAddOpen(true)}
          className="h-10 px-4 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer hover:-translate-y-0.5 duration-150"
        >
          <Plus size={14} />
          <span>Add Application</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
        {/* Search */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400 pointer-events-none">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-200/80 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-0 transition-colors"
          />
        </div>

        {/* Filter Status */}
        <Select
          options={statusFilterOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full"
        />

        {/* Sort */}
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'Newest' | 'Oldest')}
          className="w-full"
        />
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="text-center py-16 text-xs font-semibold text-neutral-450 bg-white border border-neutral-200/85 rounded-xl shadow-sm">
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-200/85 rounded-xl shadow-sm text-xs font-semibold text-neutral-450">
          No applications found.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <ApplicationTable 
            applications={applications} 
            onEditClick={triggerEdit} 
            onDeleteClick={triggerDelete} 
          />
          
          {/* Mobile Cards List View */}
          <div className="flex flex-col gap-3">
            {applications.map((app) => (
              <ApplicationCard 
                key={app.id} 
                app={app} 
                onEditClick={triggerEdit} 
                onDeleteClick={triggerDelete} 
              />
            ))}
          </div>
        </>
      )}

      {/* Modals & Dialogs */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Application">
        <ApplicationForm onSubmit={handleAddSubmit} onCancel={() => setIsAddOpen(false)} />
      </Modal>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Application">
        <ApplicationForm 
          initialData={selectedApp} 
          onSubmit={handleEditSubmit} 
          onCancel={() => setIsEditOpen(false)} 
        />
      </Modal>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        companyName={selectedApp?.companyName || ''}
        isDeleting={isDeleting}
      />
    </div>
  )
}
