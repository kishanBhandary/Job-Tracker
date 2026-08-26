'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signInUser } from '@/app/actions/auth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await signInUser(email, password)
      if (res.error) {
        setError(res.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] bg-white px-9 py-10 border border-neutral-200/80 rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-6 relative z-10">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center gap-2">
        <img 
          src="/job.png" 
          alt="CareerTrack Logo" 
          className="w-24 h-24 object-contain select-none transition-transform duration-300 hover:scale-105"
        />
        <h1 className="text-xl font-black text-neutral-900 tracking-tight mt-1.5">CareerTrack</h1>
        <div className="flex flex-col gap-0.5 mt-1">
          <p className="text-xs font-semibold text-neutral-700">Welcome back</p>
          <p className="text-[11px] text-neutral-450">Sign in to continue managing your job search.</p>
        </div>
      </div>

      {/* Pill Segmented Control */}
      <div className="bg-neutral-100/80 p-0.5 rounded-lg flex border border-neutral-200/20">
        <button 
          onClick={() => router.push('/login')}
          className="flex-1 text-center py-1.5 text-xs font-bold rounded-[6px] transition-all bg-white text-neutral-900 shadow-sm"
        >
          Login
        </button>
        <button 
          onClick={() => router.push('/register')}
          className="flex-1 text-center py-1.5 text-xs font-semibold rounded-[6px] transition-all text-neutral-400 hover:text-neutral-600"
        >
          Register
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200/60 text-red-650 text-xs font-medium rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email Address */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-neutral-200 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 outline-none transition-colors"
            placeholder="email@example.com"
            disabled={loading}
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 text-left relative">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-200 py-1.5 pr-8 text-sm text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 outline-none transition-colors"
              placeholder="••••••••••••"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-[11px] text-neutral-450 mt-1">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-700 select-none">
            <input 
              type="checkbox" 
              className="w-3.5 h-3.5 accent-black border border-neutral-300 rounded focus:ring-0 cursor-pointer"
            />
            <span className="font-medium">Keep me signed in</span>
          </label>
          <Link 
            href="/forgot-password" 
            className="font-semibold text-neutral-400 hover:text-neutral-950 hover:underline transition-colors"
          >
            Forgot?
          </Link>
        </div>

        {/* Sign In CTA Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-neutral-900 text-white rounded-lg h-12 text-xs font-bold tracking-wide hover:bg-neutral-800 active:bg-black transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-xs text-neutral-400">
        Don't have an account?{' '}
        <Link href="/register" className="font-semibold text-neutral-900 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
