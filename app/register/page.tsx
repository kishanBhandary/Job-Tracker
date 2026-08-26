import React from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}
