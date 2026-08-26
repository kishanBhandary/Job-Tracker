'use client'

import React, { useState } from 'react'
import { Plus, Briefcase, Calendar, Award, XCircle, ChevronDown, BarChart2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { AuthUser } from '@/lib/auth'
import { Modal } from '../ui/Modal'
import { RecentApplications } from './RecentApplications'
import { EmptyDashboard } from './EmptyDashboard'
import { ApplicationForm } from '../applications/ApplicationForm'
import { createJobApplication } from '@/lib/actions'

interface DashboardClientProps {
  user: AuthUser
  stats: {
    total: number
    applied: number
    screening: number
    interview: number
    offer: number
    rejected: number
  }
  recent: any[]
}

export function DashboardClient({ user, stats, recent }: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  const getGreeting = () => {
    const hr = new Date().getHours()
    if (hr < 12) return 'Good morning'
    if (hr < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  const firstName = user.name.split(' ')[0] || 'User'

  // Calculations for dynamic supporting statistics
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const addedThisMonth = recent.filter(app => new Date(app.appliedDate) >= thirtyDaysAgo).length

  const responseRate = stats.total > 0 
    ? Math.round(((stats.screening + stats.interview + stats.offer) / stats.total) * 100) 
    : 0
  const offerRate = stats.total > 0
    ? Math.round((stats.offer / stats.total) * 100)
    : 0
  const rejectedRate = stats.total > 0
    ? Math.round((stats.rejected / stats.total) * 100)
    : 0

  // 1. Process real database data for the last 30 days activity chart
  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    d.setHours(0, 0, 0, 0)
    return d
  })

  const activityData = last30Days.map(date => {
    const count = recent.filter(app => {
      const appDate = new Date(app.appliedDate)
      appDate.setHours(0, 0, 0, 0)
      return appDate.getTime() === date.getTime()
    }).length
    return { date, count }
  })

  const maxActivityCount = Math.max(...activityData.map(d => d.count), 0)
  
  // Create path for SVG line chart
  const chartWidth = 500
  const chartHeight = 80
  const points = activityData.map((d, i) => {
    const x = (i * (chartWidth / 29)).toFixed(1)
    const y = maxActivityCount > 0 
      ? (chartHeight - 10 - (d.count / maxActivityCount) * (chartHeight - 20)).toFixed(1)
      : (chartHeight - 15).toFixed(1) // Flat line if no data
    return { x, y, count: d.count, date: d.date }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = maxActivityCount > 0 
    ? `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
    : ''

  const handleAddSubmit = async (formData: any) => {
    const res = await createJobApplication(formData)
    if (res.success) {
      setSuccessMessage('Application added successfully.')
      setIsModalOpen(false)
      router.refresh()
      
      setTimeout(() => setSuccessMessage(''), 4000)
      return { success: true }
    }
    return { 
      success: false, 
      error: res.error, 
      validationErrors: res.validationErrors 
    }
  }

  // Pipeline helper percentages
  const getPipelinePercentage = (count: number) => {
    return stats.total > 0 ? (count / stats.total) * 100 : 0
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-200">
      
      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-250/30 text-emerald-800 text-xs font-semibold rounded-xl shadow-sm text-left">
          {successMessage}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 text-left">
        <div>
          <h2 className="text-[32px] font-black text-neutral-950 tracking-tight leading-none">
            {getGreeting()}, {firstName}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2.5">
            <span className="text-[14px] text-neutral-450 font-semibold leading-none">
              Here's a snapshot of your current job search.
            </span>
            <span className="hidden sm:inline text-[13px] text-neutral-350 font-bold leading-none select-none">•</span>
            <span className="text-[13px] text-neutral-400 font-semibold sm:font-bold leading-none mt-1 sm:mt-0">
              {getFormattedDate()}
            </span>
          </div>
        </div>
        
        {stats.total > 0 && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 bg-neutral-950 hover:bg-neutral-900 active:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer hover:-translate-y-0.5 duration-150"
          >
            <Plus size={14} className="stroke-[3px]" />
            <span>Add application</span>
          </button>
        )}
      </div>

      {stats.total === 0 ? (
        <EmptyDashboard onAddFirst={() => setIsModalOpen(true)} />
      ) : (
        <div className="flex flex-col gap-8">
          
          {/* Card Overview Grid (Hierarchy-aware layout) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            
            {/* Primary Dark Metric Card */}
            <div className="bg-neutral-950 text-white rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-neutral-950/10 text-left flex flex-col justify-between min-h-[120px] border border-neutral-900">
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">Total Applications</span>
                  <span className="text-3xl font-extrabold text-white tracking-tight mt-1.5">{stats.total}</span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0">
                  <Briefcase size={14} className="sm:w-4 sm:h-4" />
                </div>
              </div>
              <span className="text-xs text-neutral-400 font-bold mt-2">+{addedThisMonth} added this month</span>
            </div>

            {/* Secondary Metric: Interviews */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 hover:border-neutral-300 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-amber-500/5 text-left flex flex-col justify-between min-h-[120px]">
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">Interviews</span>
                  <span className="text-3xl font-extrabold text-neutral-950 tracking-tight mt-1.5">{stats.screening + stats.interview}</span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                </div>
              </div>
              <span className="text-xs text-neutral-450 font-bold mt-2">{responseRate}% response rate</span>
            </div>

            {/* Secondary Metric: Offers */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 hover:border-neutral-300 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-emerald-500/5 text-left flex flex-col justify-between min-h-[120px]">
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">Offers Received</span>
                  <span className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1.5">{stats.offer}</span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Award size={14} className="sm:w-4 sm:h-4" />
                </div>
              </div>
              <span className="text-xs text-neutral-450 font-bold mt-2">{offerRate}% conversion rate</span>
            </div>

            {/* Secondary Metric: Rejected */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 hover:border-neutral-300 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-rose-500/5 text-left flex flex-col justify-between min-h-[120px]">
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">Rejections</span>
                  <span className="text-3xl font-extrabold text-rose-600 tracking-tight mt-1.5">{stats.rejected}</span>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <XCircle size={14} className="sm:w-4 sm:h-4" />
                </div>
              </div>
              <span className="text-xs text-neutral-450 font-bold mt-2">{rejectedRate}% of total</span>
            </div>

          </div>

          {/* Pipeline Funnel & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left">
            
            {/* Pipeline horizontal bar cards (left 2/5 columns) */}
            <div className="lg:col-span-2 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-5 justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-450">Application Pipeline</h3>
                <p className="text-[11px] font-semibold text-neutral-400 mt-1">Overview of application stages</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Applied Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-neutral-750 mb-1">
                    <span>Applied</span>
                    <span>{stats.applied}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${getPipelinePercentage(stats.applied)}%` }}
                    />
                  </div>
                </div>

                {/* Screening Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-neutral-750 mb-1">
                    <span>Screening</span>
                    <span>{stats.screening}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${getPipelinePercentage(stats.screening)}%` }}
                    />
                  </div>
                </div>

                {/* Interview Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-neutral-750 mb-1">
                    <span>Interview</span>
                    <span>{stats.interview}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: `${getPipelinePercentage(stats.interview)}%` }}
                    />
                  </div>
                </div>

                {/* Offer Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-neutral-750 mb-1">
                    <span>Offer</span>
                    <span className="text-emerald-600">{stats.offer}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${getPipelinePercentage(stats.offer)}%` }}
                    />
                  </div>
                </div>

                {/* Rejected Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-neutral-750 mb-1">
                    <span>Rejected</span>
                    <span className="text-rose-600">{stats.rejected}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                      style={{ width: `${getPipelinePercentage(stats.rejected)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Chart card (right 3/5 columns) */}
            <div className="lg:col-span-3 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-450">Application Activity</h3>
                  <p className="text-[11px] font-semibold text-neutral-400 mt-1">Timeline of application events</p>
                </div>
                
                <div className="flex items-center gap-1 px-2.5 py-1.5 border border-neutral-200/60 rounded-lg text-[10px] font-bold text-neutral-550 bg-neutral-50 shrink-0">
                  <span>Last 30 days</span>
                  <ChevronDown size={12} className="text-neutral-400" />
                </div>
              </div>

              {/* Chart line SVG */}
              <div className="relative h-28 flex items-end justify-center w-full mt-4">
                {stats.total <= 1 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-white/90 z-10">
                    <BarChart2 size={24} className="text-neutral-300 mb-1.5" />
                    <p className="text-xs font-bold text-neutral-800">Application Activity</p>
                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                      Your activity will become more meaningful as you track more applications.
                    </p>
                  </div>
                ) : null}

                <div className="w-full h-[80px]">
                  <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#F1F1F3" strokeWidth="1" />
                    <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="#F1F1F3" strokeWidth="1" />
                    
                    {maxActivityCount > 0 && areaPath && (
                      <path 
                        d={areaPath} 
                        fill="url(#chart-glow)" 
                        opacity="0.6" 
                      />
                    )}

                    <path 
                      d={linePath} 
                      fill="none" 
                      stroke="#6366F1" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Render data points */}
                    {maxActivityCount > 0 && points.map((p, idx) => {
                      if (p.count === 0) return null
                      return (
                        <circle 
                          key={idx} 
                          cx={p.x} 
                          cy={p.y} 
                          r="4" 
                          className="fill-indigo-600 stroke-white stroke-2 shadow-sm"
                        />
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* Chart Bottom Dates */}
              <div className="flex items-center justify-between text-[9px] font-bold text-neutral-400 mt-2 px-1 border-t border-neutral-100 pt-2 select-none uppercase tracking-wider">
                <span>30 days ago</span>
                <span>{stats.total} application{stats.total > 1 ? 's' : ''} tracked</span>
                <span>Today</span>
              </div>
            </div>

          </div>

          {/* Recent Applications Section */}
          <RecentApplications applications={recent} />
        </div>
      )}

      {/* Add Application Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add Application"
      >
        <ApplicationForm 
          onSubmit={handleAddSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  )
}
