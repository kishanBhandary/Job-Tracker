import React from 'react'
import Link from 'next/link'
import { StatusBadge } from './StatusBadge'
import { Eye, Edit2, Trash2 } from 'lucide-react'

interface JobApplication {
  id: string
  companyName: string
  jobTitle: string
  status: string
  appliedDate: Date
  interviewDate: Date | null
}

interface ApplicationCardProps {
  app: JobApplication
  onDeleteClick: (id: string, companyName: string) => void
  onEditClick: (app: JobApplication) => void
}

export function ApplicationCard({ app, onDeleteClick, onEditClick }: ApplicationCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getCompanyInitial = (company: string) => {
    return company ? company.charAt(0).toUpperCase() : '?'
  }

  const getGradientForLetter = (char: string) => {
    const code = (char.charCodeAt(0) || 0) % 5
    const gradients = [
      'from-indigo-500 to-purple-600 shadow-indigo-500/10',
      'from-emerald-400 to-teal-500 shadow-emerald-500/10',
      'from-amber-400 to-orange-500 shadow-amber-500/10',
      'from-rose-400 to-pink-500 shadow-rose-500/10',
      'from-sky-400 to-blue-500 shadow-sky-500/10',
    ]
    return gradients[code]
  }

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex flex-col gap-3.5 md:hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getGradientForLetter(app.companyName)} text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0 uppercase select-none`}>
            {getCompanyInitial(app.companyName)}
          </div>
          <div className="text-left">
            <h4 className="font-bold text-neutral-900 text-sm">
              <Link href={`/dashboard/applications/${app.id}`} className="hover:underline">
                {app.companyName}
              </Link>
            </h4>
            <p className="text-xs text-neutral-500 font-semibold mt-0.5">{app.jobTitle}</p>
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-neutral-100 py-3 my-0.5 text-neutral-450 font-medium text-left">
        <div>
          <span className="block text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Applied Date</span>
          <span className="mt-1 block text-neutral-750 font-bold">{formatDate(app.appliedDate)}</span>
        </div>
        <div>
          <span className="block text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Interview Date</span>
          <span className="mt-1 block text-neutral-750 font-bold">{formatDate(app.interviewDate)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link 
          href={`/dashboard/applications/${app.id}`} 
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-black font-semibold transition-colors"
        >
          <Eye size={14} />
          <span>Details</span>
        </Link>
        <button 
          onClick={() => onEditClick(app)} 
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-black font-semibold transition-colors cursor-pointer"
        >
          <Edit2 size={14} />
          <span>Edit</span>
        </button>
        <button 
          onClick={() => onDeleteClick(app.id, app.companyName)} 
          className="flex items-center gap-1 text-xs text-neutral-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  )
}
