'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetLink } from '@/app/actions/auth'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const res = await sendPasswordResetLink(email)
      if (res.error) {
        setError(res.error)
      } else {
        setSuccessMsg(res.message || 'Password reset link sent! Check your inbox.')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
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
          <p className="text-xs font-semibold text-neutral-700">Forgot Password</p>
          <p className="text-[11px] text-neutral-450">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200/60 text-red-650 text-xs font-medium rounded-lg">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200/60 text-green-700 text-xs font-medium rounded-lg">
          {successMsg}
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

        {/* Send Reset Link Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-neutral-900 text-white rounded-lg h-12 text-xs font-bold tracking-wide hover:bg-neutral-800 active:bg-black transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center text-xs">
        <Link href="/login" className="font-semibold text-neutral-400 hover:text-black transition-colors">
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
