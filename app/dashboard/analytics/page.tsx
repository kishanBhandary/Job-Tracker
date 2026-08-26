import React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getAnalyticsStats } from '@/lib/actions'
import { StatCard } from '@/components/dashboard/StatCard'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const res = await getAnalyticsStats()

  if (res.error) {
    return (
      <div className="p-3.5 bg-rose-50 border border-rose-250/30 text-rose-700 text-xs font-semibold rounded-lg">
        <h3 className="font-bold">Something went wrong.</h3>
        <p className="mt-1 font-medium">Failed to calculate analytics. Please try again.</p>
      </div>
    )
  }

  const { 
    total = 0, 
    rates = { interviewRate: 0, offerRate: 0, rejectionRate: 0 }, 
    chartData = [] 
  } = res

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-neutral-955 tracking-tight leading-none">Analytics</h2>
        <p className="text-xs font-semibold text-neutral-450 mt-2">Key metrics and progress of your job search.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Applications" 
          value={total} 
          description="All logged opportunities"
        />
        <StatCard 
          title="Interview Rate" 
          value={rates.interviewRate} 
          description="Screening/Interviews"
          className="after:content-['%']" 
        />
        <StatCard 
          title="Offer Rate" 
          value={rates.offerRate} 
          description="Success conversion"
        />
        <StatCard 
          title="Rejection Rate" 
          value={rates.rejectionRate} 
          description="Unsuccessful outcomes"
        />
      </div>

      {/* Simple Status Chart Section */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-6 flex flex-col gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="text-left">
          <h3 className="text-sm font-semibold text-neutral-900">Applications by Status</h3>
          <p className="text-xs text-neutral-450 mt-0.5 font-medium">Visual breakdown of your active pipeline.</p>
        </div>

        {total === 0 ? (
          <div className="text-center py-12 text-xs font-medium text-neutral-400">
            No applications logged. Add some applications to generate charts.
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-xl">
            {chartData.map((item) => {
              const percentage = total > 0 ? (item.count / total) * 100 : 0
              
              const statusClassMap: Record<string, string> = {
                Applied: 'bg-neutral-900',
                Screening: 'bg-blue-600',
                Interview: 'bg-amber-500',
                Offer: 'bg-emerald-600',
                Rejected: 'bg-rose-500',
              }
              const progressBg = statusClassMap[item.status] || 'bg-neutral-900'

              return (
                <div key={item.status} className="flex flex-col gap-1.5 text-xs text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-800">{item.status}</span>
                    <span className="text-neutral-450 font-bold">
                      {item.count} {item.count === 1 ? 'job' : 'jobs'} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${progressBg} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
