import React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { getJobApplicationById } from '@/lib/actions'
import { ApplicationDetailsClient } from '@/components/applications/ApplicationDetailsClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface ApplicationDetailsPageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const res = await getJobApplicationById(id)

  if (res.error || !res.application) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 text-red-655 text-sm rounded">
        <h3 className="font-semibold text-red-700">Application Not Found</h3>
        <p className="mt-1 text-red-600">{res.error || 'The job application could not be found or you do not have permission to view it.'}</p>
        <div className="mt-4">
          <a href="/dashboard/applications" className="text-sm font-semibold underline text-neutral-800 hover:text-black">
            Back to Applications
          </a>
        </div>
      </div>
    )
  }

  return <ApplicationDetailsClient application={res.application} />
}
