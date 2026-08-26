import React from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
