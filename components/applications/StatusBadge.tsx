import React from 'react'

export type JobStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Normalize the status string
  const normalizedStatus = (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()) as JobStatus
  
  const statusClasses: Record<JobStatus, { dot: string; bg: string; text: string; border: string }> = {
    Applied: {
      dot: 'bg-neutral-400',
      bg: 'bg-neutral-50',
      text: 'text-neutral-600',
      border: 'border-neutral-200'
    },
    Screening: {
      dot: 'bg-blue-500',
      bg: 'bg-blue-50/40',
      text: 'text-blue-700',
      border: 'border-blue-200/50'
    },
    Interview: {
      dot: 'bg-amber-500',
      bg: 'bg-amber-50/45',
      text: 'text-amber-700',
      border: 'border-amber-250/30'
    },
    Offer: {
      dot: 'bg-emerald-500',
      bg: 'bg-emerald-50/30',
      text: 'text-emerald-700',
      border: 'border-emerald-250/30'
    },
    Rejected: {
      dot: 'bg-rose-500',
      bg: 'bg-rose-50/30',
      text: 'text-rose-700',
      border: 'border-rose-200/40'
    },
  }
  
  const current = statusClasses[normalizedStatus] || statusClasses.Applied
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md border ${current.bg} ${current.text} ${current.border} select-none`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {normalizedStatus}
    </span>
  )
}
