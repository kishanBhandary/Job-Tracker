'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatusBadge } from '../applications/StatusBadge'
import { ArrowRight } from 'lucide-react'

interface JobApplication {
  id: string
  companyName: string
  jobTitle: string
  status: string
  appliedDate: Date
  interviewDate?: Date | null
}

interface RecentApplicationsProps {
  applications: JobApplication[]
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  const router = useRouter()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getCompanyInitial = (company: string) => {
    return company ? company.charAt(0).toUpperCase() : '?'
  }

  // Get a premium gradient based on company name
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
    <div className="bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-100 bg-white/40">
        <h3 className="text-sm font-bold text-neutral-900 tracking-tight">Recent Applications</h3>
        <Link 
          href="/dashboard/applications" 
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight size={14} />
        </Link>
      </div>
      
      {applications.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-neutral-400">
          No applications added yet. Add one to start tracking.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/20 text-neutral-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-3 font-bold text-[10px] tracking-widest">Company</th>
                <th className="px-6 py-3 font-bold text-[10px] tracking-widest">Role</th>
                <th className="px-6 py-3 font-bold text-[10px] tracking-widest">Status</th>
                <th className="px-6 py-3 font-bold text-[10px] tracking-widest">Applied</th>
                <th className="px-6 py-3 font-bold text-[10px] tracking-widest">Next Step</th>
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
                  
                  {/* Role */}
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
                  
                  {/* Next Step */}
                  <td className="px-6 py-4 text-neutral-400 font-medium">
                    {app.interviewDate ? formatDate(app.interviewDate) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
