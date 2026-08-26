'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  Settings
} from 'lucide-react'
import type { AuthUser } from '@/lib/auth'

interface SidebarProps {
  user: AuthUser
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const workspaceItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ]

  const preferencesItems = [
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const initials = getInitials(user.name)

  return (
    <aside className="hidden md:flex flex-col w-[260px] border-r border-neutral-150 bg-white min-h-screen p-6 shrink-0 text-left">
      {/* Brand */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center p-0.5 bg-white border border-neutral-200/50 shadow-sm shrink-0">
          <img 
            src="/job.png" 
            alt="CareerTrack Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-xl font-bold text-neutral-900 tracking-tight">CareerTrack</span>
      </div>

      {/* Nav groups */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Workspace Group */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 mb-1">
            Workspace
          </span>
          <nav className="flex flex-col gap-1">
            {workspaceItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 h-11 text-xs font-semibold rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-neutral-900 text-white shadow-sm' 
                      : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/50'
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-neutral-400"} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Preferences Group */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 mb-1">
            Preferences
          </span>
          <nav className="flex flex-col gap-1">
            {preferencesItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 h-11 text-xs font-semibold rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-neutral-900 text-white shadow-sm' 
                      : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/50'
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-neutral-400"} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

      </div>

      <hr className="border-neutral-100 my-4" />

      {/* Profile Footer */}
      <div className="flex items-center gap-3 px-1 py-0.5">
        <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs font-black select-none border border-neutral-950 shadow-sm shrink-0">
          {initials}
        </div>
        <div className="flex flex-col text-left truncate">
          <span className="text-xs font-bold text-neutral-900 truncate leading-none">{user.name}</span>
          <span className="text-[10px] text-neutral-400 font-semibold mt-1.5 leading-none">Account</span>
        </div>
      </div>
    </aside>
  )
}
