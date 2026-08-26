import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50/50">
      {/* Sidebar (Fixed-height container child) */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header user={user} />
        
        {/* Children content page (Scrolls independently) */}
        <main className="flex-1 overflow-y-auto px-6 md:px-8 py-10 max-w-[1280px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
