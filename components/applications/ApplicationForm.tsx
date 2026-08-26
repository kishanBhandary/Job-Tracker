'use client'

import React, { useState } from 'react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

interface ApplicationFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string; validationErrors?: any }>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ApplicationForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting: externalIsSubmitting
}: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    jobTitle: initialData?.jobTitle || '',
    location: initialData?.location || '',
    jobType: initialData?.jobType || 'Full-time',
    salary: initialData?.salary || '',
    status: initialData?.status || 'Applied',
    appliedDate: initialData?.appliedDate 
      ? new Date(initialData.appliedDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    interviewDate: initialData?.interviewDate 
      ? new Date(initialData.interviewDate).toISOString().split('T')[0] 
      : '',
    jobUrl: initialData?.jobUrl || '',
    notes: initialData?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear errors for field on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')
    setErrors({})

    // Client side validation to prevent needless roundtrips
    const clientErrors: Record<string, string> = {}
    if (!formData.companyName.trim()) clientErrors.companyName = 'Company name is required'
    if (!formData.jobTitle.trim()) clientErrors.jobTitle = 'Job title is required'
    if (!formData.appliedDate) clientErrors.appliedDate = 'Applied date is required'
    
    // Simple URL validation
    if (formData.jobUrl && !formData.jobUrl.startsWith('http://') && !formData.jobUrl.startsWith('https://')) {
      clientErrors.jobUrl = 'URL must start with http:// or https://'
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await onSubmit(formData)
      if (!res.success) {
        if (res.validationErrors) {
          // Flatten server-side Zod validation errors
          const valErrors: Record<string, string> = {}
          Object.keys(res.validationErrors).forEach((key) => {
            valErrors[key] = res.validationErrors[key][0]
          })
          setErrors(valErrors)
        } else {
          setGeneralError(res.error || 'Failed to save application.')
        }
      }
    } catch (err: any) {
      setGeneralError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const jobTypeOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Co-op', label: 'Co-op' },
  ]

  const statusOptions = [
    { value: 'Applied', label: 'Applied' },
    { value: 'Screening', label: 'Screening' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Offer', label: 'Offer' },
    { value: 'Rejected', label: 'Rejected' },
  ]

  const loading = isSubmitting || externalIsSubmitting

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded">
          {generalError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company Name *"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          error={errors.companyName}
          placeholder="e.g. Google"
          disabled={loading}
          required
        />

        <Input
          label="Job Title *"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          error={errors.jobTitle}
          placeholder="e.g. Software Engineer"
          disabled={loading}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          error={errors.location}
          placeholder="e.g. Bangalore, Remote"
          disabled={loading}
        />

        <Select
          label="Job Type"
          name="jobType"
          value={formData.jobType}
          onChange={handleChange}
          options={jobTypeOptions}
          error={errors.jobType}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Salary"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          error={errors.salary}
          placeholder="e.g. ₹12 LPA or $100,000"
          disabled={loading}
        />

        <Select
          label="Status *"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Applied Date *"
          name="appliedDate"
          type="date"
          value={formData.appliedDate}
          onChange={handleChange}
          error={errors.appliedDate}
          disabled={loading}
          required
        />

        <Input
          label="Interview Date"
          name="interviewDate"
          type="date"
          value={formData.interviewDate}
          onChange={handleChange}
          error={errors.interviewDate}
          disabled={loading}
        />
      </div>

      <Input
        label="Job URL"
        name="jobUrl"
        type="text"
        value={formData.jobUrl}
        onChange={handleChange}
        error={errors.jobUrl}
        placeholder="https://example.com/jobs/123"
        disabled={loading}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-0 disabled:opacity-50 disabled:bg-neutral-50 transition-colors resize-none"
          placeholder="Add any details about the hiring process..."
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-neutral-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Application'}
        </Button>
      </div>
    </form>
  )
}
