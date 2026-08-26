'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  Settings, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  BarChart3
} from 'lucide-react'
import type { AuthUser } from '../../lib/auth'
import { signOutUser } from '@/app/actions/auth'

interface HeaderProps {
  user: AuthUser
}

export function Header({ user }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Applications', href: '/dashboard/applications', icon: Briefcase },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    const res = await signOutUser()
    if (res.success) {
      router.push('/login')
      router.refresh()
    }
  }

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

  // Handle global search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchVal.trim()) return
    router.push(`/dashboard/applications?q=${encodeURIComponent(searchVal)}`)
  }

  // Keyboard shortcut listener for (⌘ K or Ctrl K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = getInitials(user.name)

  return (
    <header className="bg-white border-b border-neutral-150 h-[72px] px-8 flex items-center justify-between w-full relative z-40 shrink-0">
      
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded hover:bg-neutral-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 text-base font-bold text-neutral-900 tracking-tight">
          <img 
            src="/job.png" 
            alt="CareerTrack Logo" 
            className="w-5 h-5 object-contain"
          />
          <span>CareerTrack</span>
        </Link>
      </div>

      {/* Global Search Bar (Left/Center) */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center w-full max-w-[400px]">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400 pointer-events-none">
            <Search size={15} />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search applications..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-10 pl-9 pr-14 py-2 text-xs bg-neutral-50 border border-neutral-200/60 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-none focus:ring-0 transition-all font-medium"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 border border-neutral-200 rounded text-[9px] font-bold text-neutral-400 bg-white pointer-events-none uppercase tracking-wider select-none">
            ⌘K
          </kbd>
        </div>
      </form>

      {/* Right Utility Bar */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        
        {/* Notification Bell */}
        <button 
          className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell size={16} />
        </button>

        {/* Help Circle */}
        <button 
          className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
          title="Help"
        >
          <HelpCircle size={16} />
        </button>

        <div className="w-[1px] h-6 bg-neutral-200 hidden sm:block" />

        {/* Profile Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 focus:outline-none group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs font-black select-none border border-neutral-950 shadow-sm transition-all group-hover:bg-neutral-800">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-neutral-900 group-hover:text-black leading-none">{user.name.split(' ')[0]}</span>
              <span className="text-[10px] text-neutral-400 font-semibold mt-1 leading-none">Account</span>
            </div>
            <ChevronDown size={14} className="text-neutral-400 group-hover:text-neutral-600 transition-colors shrink-0" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-56 bg-white border border-neutral-200 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-100 text-left">
              {/* Profile details */}
              <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col truncate">
                  <p className="font-bold text-neutral-900 truncate leading-none">{user.name}</p>
                  <p className="text-neutral-400 font-semibold truncate mt-1.5 leading-none">{user.email}</p>
                </div>
              </div>
              
              <Link 
                href="/dashboard/settings" 
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-semibold transition-colors mt-1"
              >
                <Settings size={14} className="text-neutral-400" />
                <span>Profile Settings</span>
              </Link>
              
              <hr className="border-neutral-100 my-1" />
              
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  handleLogout()
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-neutral-600 hover:text-rose-600 hover:bg-rose-50/20 font-semibold transition-colors w-full text-left cursor-pointer"
              >
                <LogOut size={14} className="text-neutral-400" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-[100%] left-0 right-0 bg-white border-b border-neutral-200 shadow-md md:hidden flex flex-col p-4 gap-1 animate-in slide-in-from-top-2 duration-150 text-left">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-neutral-50 text-neutral-900 border border-neutral-200/50' 
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/50'
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            )
          })}
          <hr className="my-2 border-neutral-150" />
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              handleLogout()
            }}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg text-neutral-500 hover:text-rose-600 hover:bg-rose-50/20 transition-colors text-left w-full cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  )
}
