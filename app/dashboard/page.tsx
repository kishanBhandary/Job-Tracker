import React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getDashboardStats } from '@/lib/actions'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const res = await getDashboardStats()
  
  if (res.error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-650 text-sm rounded">
        <h3 className="font-semibold">Something went wrong.</h3>
        <p className="mt-1">Please try again.</p>
      </div>
    )
  }

  return (
    <DashboardClient 
      user={user} 
      stats={res.stats!} 
      recent={res.recent!} 
    />
  )
}
