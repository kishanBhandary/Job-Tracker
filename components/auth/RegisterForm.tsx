'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { signUpUser } from '@/app/actions/auth'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return ''
    if (pass.length < 6) return 'Weak'
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++
    
    if (score >= 3) return 'Strong'
    if (score >= 1) return 'Medium'
    return 'Weak'
  }

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')

    const clientErrors: Record<string, string> = {}
    if (!name.trim()) clientErrors.name = 'Full name is required'
    if (!email.trim()) clientErrors.email = 'Valid email is required'
    if (password.length < 8) clientErrors.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) clientErrors.confirmPassword = 'Passwords do not match'

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    setLoading(true)
    try {
      const res = await signUpUser(email, password, name)
      if (res.error) {
        setGeneralError(res.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setGeneralError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] bg-white px-9 py-10 border border-neutral-200/80 rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-6 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center gap-2">
        <img 
          src="/job.png" 
          alt="CareerTrack Logo" 
          className="w-24 h-24 object-contain select-none transition-transform duration-300 hover:scale-105"
        />
        <h1 className="text-xl font-black text-neutral-900 tracking-tight mt-1.5">CareerTrack</h1>
        <div className="flex flex-col gap-0.5 mt-1">
          <p className="text-xs font-semibold text-neutral-700">Create your account</p>
          <p className="text-[11px] text-neutral-450">Start organizing your career opportunities.</p>
        </div>
      </div>

      {/* Pill Segmented Control */}
      <div className="bg-neutral-100/80 p-0.5 rounded-lg flex border border-neutral-200/20">
        <button 
          onClick={() => router.push('/login')}
          className="flex-1 text-center py-1.5 text-xs font-semibold rounded-[6px] transition-all text-neutral-400 hover:text-neutral-600"
        >
          Login
        </button>
        <button 
          onClick={() => router.push('/register')}
          className="flex-1 text-center py-1.5 text-xs font-bold rounded-[6px] transition-all bg-white text-neutral-900 shadow-sm"
        >
          Register
        </button>
      </div>

      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200/60 text-red-650 text-xs font-medium rounded-lg">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1 text-left">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b border-neutral-200 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 outline-none transition-colors"
            placeholder="Kishan Bhandary"
            disabled={loading}
            required
          />
          {errors.name && <span className="text-[10px] text-red-500 mt-0.5">{errors.name}</span>}
        </div>

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
          {errors.email && <span className="text-[10px] text-red-500 mt-0.5">{errors.email}</span>}
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
          {errors.password && <span className="text-[10px] text-red-500 mt-0.5">{errors.password}</span>}

          {/* Password strength indicator */}
          {password && (
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center justify-between text-[9px] font-semibold">
                <span className="text-neutral-400">Password strength</span>
                <span className={`uppercase tracking-wider ${
                  strength === 'Strong' ? 'text-emerald-600' :
                  strength === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                }`}>{strength}</span>
              </div>
              <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${
                  strength === 'Strong' ? 'bg-emerald-500 w-full' :
                  strength === 'Medium' ? 'bg-amber-400 w-2/3' : 'bg-rose-400 w-1/3'
                }`} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1 text-left relative">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-200 py-1.5 pr-8 text-sm text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-900 outline-none transition-colors"
              placeholder="••••••••••••"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="text-[10px] text-red-500 mt-0.5">{errors.confirmPassword}</span>}
        </div>

        {/* Create Account CTA Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-neutral-900 text-white rounded-lg h-12 text-xs font-bold tracking-wide hover:bg-neutral-800 active:bg-black transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-xs text-neutral-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-neutral-900 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
