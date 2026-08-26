import React from 'react'
import { getCurrentUser } from '@/lib/auth'
import { SettingsClient } from '@/components/dashboard/SettingsClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  return <SettingsClient user={user} />
}
