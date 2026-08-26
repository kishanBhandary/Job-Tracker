import React, { Suspense } from 'react'
import { getJobApplications } from '@/lib/actions'
import { ApplicationsClient } from '@/components/applications/ApplicationsClient'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ApplicationsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const res = await getJobApplications()
  
  if (res.error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-650 text-sm rounded">
        <h3 className="font-semibold">Something went wrong.</h3>
        <p className="mt-1">Please try again.</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<div className="text-sm font-semibold text-neutral-400 py-12 text-center">Loading applications...</div>}>
      <ApplicationsClient initialApplications={res.applications || []} />
    </Suspense>
  )
}
