'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit2, Trash2, Calendar, MapPin, Briefcase, DollarSign, Link as LinkIcon, FileText } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { Modal } from '../ui/Modal'
import { DeleteDialog } from './DeleteDialog'
import { ApplicationForm } from './ApplicationForm'
import { updateJobApplication, deleteJobApplication } from '@/lib/actions'
import { Button } from '../ui/Button'


interface ApplicationDetailsClientProps {
  application: any
}

export function ApplicationDetailsClient({ application: initialApp }: ApplicationDetailsClientProps) {
  const [app, setApp] = useState(initialApp)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [notification, setNotification] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const formatDate = (date: Date | null) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 4000)
  }

  const handleEditSubmit = async (formData: any) => {
    const res = await updateJobApplication(app.id, formData)
    if (res.success && res.application) {
      setApp(res.application)
      showNotification('Application updated successfully.')
      setIsEditOpen(false)
      router.refresh()
      return { success: true }
    }
    return { success: false, error: res.error, validationErrors: res.validationErrors }
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteJobApplication(app.id)
      if (res.success) {
        showNotification('Application deleted successfully.')
        setIsDeleteOpen(false)
        router.push('/dashboard/applications')
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

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Back button and notifications */}
      <div className="flex flex-col gap-3">
        {notification && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded animate-in fade-in duration-300">
            {notification}
          </div>
        )}
        <Link 
          href="/dashboard/applications" 
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Applications
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-neutral-200 rounded p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-neutral-100">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{app.companyName}</h1>
            <h2 className="text-base text-neutral-600 mt-1 font-medium">{app.jobTitle}</h2>
          </div>
          <div>
            <StatusBadge status={app.status} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-neutral-400"><MapPin size={16} /></span>
            <div>
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Location</span>
              <span className="mt-1 block text-neutral-900 font-medium">{app.location || '—'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-neutral-400"><Briefcase size={16} /></span>
            <div>
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Job Type</span>
              <span className="mt-1 block text-neutral-900 font-medium">{app.jobType || '—'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-neutral-400"><DollarSign size={16} /></span>
            <div>
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Salary</span>
              <span className="mt-1 block text-neutral-900 font-medium">{app.salary || '—'}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-neutral-400"><Calendar size={16} /></span>
            <div>
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Applied Date</span>
              <span className="mt-1 block text-neutral-900 font-medium">{formatDate(app.appliedDate)}</span>
            </div>
          </div>

          {app.interviewDate && (
            <div className="flex items-start gap-3 col-span-1 sm:col-span-2">
              <span className="mt-0.5 text-neutral-400"><Calendar size={16} /></span>
              <div>
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Interview Date</span>
                <span className="mt-1 block text-neutral-900 font-medium">{formatDate(app.interviewDate)}</span>
              </div>
            </div>
          )}

          {app.jobUrl && (
            <div className="flex items-start gap-3 col-span-1 sm:col-span-2">
              <span className="mt-0.5 text-neutral-400"><LinkIcon size={16} /></span>
              <div>
                <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Job URL</span>
                <a 
                  href={app.jobUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-1 block text-neutral-800 hover:underline font-medium break-all"
                >
                  {app.jobUrl}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="border-t border-neutral-100 pt-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-400">
            <FileText size={16} />
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Notes</span>
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50/50 p-4 border border-neutral-150 rounded whitespace-pre-wrap">
            {app.notes || 'No notes added.'}
          </p>
        </div>

        {/* Actions Button Bar */}
        <div className="border-t border-neutral-100 pt-6 flex items-center justify-end gap-3">
          <Button 
            onClick={() => setIsEditOpen(true)}
            variant="secondary"
            className="gap-2"
          >
            <Edit2 size={14} />
            Edit
          </Button>
          <Button 
            onClick={() => setIsDeleteOpen(true)}
            variant="danger"
            className="gap-2"
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Application">
        <ApplicationForm 
          initialData={app} 
          onSubmit={handleEditSubmit} 
          onCancel={() => setIsEditOpen(false)} 
        />
      </Modal>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        companyName={app.companyName}
        isDeleting={isDeleting}
      />
    </div>
  )
}
