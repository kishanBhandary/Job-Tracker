'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

interface ApplicationTableProps {
  applications: JobApplication[]
  onDeleteClick: (id: string, companyName: string) => void
  onEditClick: (app: JobApplication) => void
}

export function ApplicationTable({ applications, onDeleteClick, onEditClick }: ApplicationTableProps) {
  const router = useRouter()

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
    <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl overflow-hidden hidden md:block shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/20 text-neutral-400 font-bold uppercase tracking-wider">
            <th className="px-6 py-3 font-semibold text-[10px] tracking-widest">Company</th>
            <th className="px-6 py-3 font-semibold text-[10px] tracking-widest">Position</th>
            <th className="px-6 py-3 font-semibold text-[10px] tracking-widest">Status</th>
            <th className="px-6 py-3 font-semibold text-[10px] tracking-widest">Applied Date</th>
            <th className="px-6 py-3 font-semibold text-[10px] tracking-widest">Interview Date</th>
            <th className="px-6 py-3 font-semibold text-[10px] tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {applications.map((app) => (
            <tr 
              key={app.id} 
              onClick={() => router.push(`/dashboard/applications/${app.id}`)}
              className="hover:bg-indigo-50/10 cursor-pointer transition-colors duration-150 group"
            >
              {/* Company */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getGradientForLetter(app.companyName)} text-white flex items-center justify-center text-xs font-bold shadow-md shrink-0 uppercase select-none`}>
                    {getCompanyInitial(app.companyName)}
                  </div>
                  <span className="font-semibold text-neutral-900 group-hover:text-indigo-650 transition-colors">
                    {app.companyName}
                  </span>
                </div>
              </td>

              {/* Position */}
              <td className="px-6 py-4 text-neutral-500 font-medium">
                {app.jobTitle}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <StatusBadge status={app.status} />
              </td>

              {/* Applied Date */}
              <td className="px-6 py-4 text-neutral-400 font-medium">
                {formatDate(app.appliedDate)}
              </td>

              {/* Interview Date */}
              <td className="px-6 py-4 text-neutral-450 font-medium">
                {formatDate(app.interviewDate)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link 
                    href={`/dashboard/applications/${app.id}`} 
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-neutral-400 hover:text-black transition-colors"
                    title="View details"
                  >
                    <Eye size={15} />
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditClick(app)
                    }} 
                    className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                    title="Edit application"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteClick(app.id, app.companyName)
                    }} 
                    className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete application"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
