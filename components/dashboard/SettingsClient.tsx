'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../ui/Input'
import type { AuthUser } from '@/lib/auth'
import { updateProfile, changePassword, signOutUser } from '@/app/actions/auth'

interface SettingsClientProps {
  user: AuthUser
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [name, setName] = useState(user.name)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Password fields
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const router = useRouter()

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSuccess('')
    setProfileError('')

    if (!name.trim()) {
      setProfileError('Name is required')
      return
    }

    setIsSavingProfile(true)
    try {
      const res = await updateProfile(name)
      if (res.error) {
        setProfileError(res.error)
      } else {
        setProfileSuccess('Profile updated successfully.')
        router.refresh()
      }
    } catch (err: any) {
      setProfileError(err.message || 'Failed to save changes.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccess('')
    setPasswordError('')

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setIsUpdatingPassword(true)
    try {
      const res = await changePassword(newPassword)
      if (res.error) {
        setPasswordError(res.error)
      } else {
        setPasswordSuccess('Password changed successfully.')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleLogout = async () => {
    const res = await signOutUser()
    if (res.success) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-2xl font-bold text-neutral-955 tracking-tight leading-none">Settings</h2>
        <p className="text-xs font-semibold text-neutral-450 mt-2">Manage your account details and security settings.</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-5">
        <div className="text-left">
          <h3 className="text-sm font-semibold text-neutral-900">Profile Details</h3>
          <p className="text-xs text-neutral-450 mt-0.5 font-medium">Update your basic profile information.</p>
        </div>

        {profileSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-250/30 text-emerald-800 text-xs font-semibold rounded-lg shadow-sm text-left">
            {profileSuccess}
          </div>
        )}

        {profileError && (
          <div className="p-3.5 bg-rose-50 border border-rose-250/30 text-rose-700 text-xs font-semibold rounded-lg text-left">
            {profileError}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSavingProfile}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={user.email}
            disabled
            className="bg-neutral-50 text-neutral-400 border-neutral-200 select-none pointer-events-none"
          />

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={isSavingProfile}
              className="h-9 px-4 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Reset Form */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-5">
        <div className="text-left">
          <h3 className="text-sm font-semibold text-neutral-900">Change Password</h3>
          <p className="text-xs text-neutral-450 mt-0.5 font-medium">Ensure your account is using a secure password.</p>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-250/30 text-emerald-800 text-xs font-semibold rounded-lg shadow-sm text-left">
            {passwordSuccess}
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 bg-rose-50 border border-rose-250/30 text-rose-700 text-xs font-semibold rounded-lg text-left">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="•••••••• (min 8 characters)"
            disabled={isUpdatingPassword}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isUpdatingPassword}
            required
          />

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={isUpdatingPassword}
              className="h-9 px-4 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isUpdatingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Logout Card */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-sm font-semibold text-neutral-900">Logout</h3>
          <p className="text-xs text-neutral-450 mt-0.5 font-medium">End your current session on this device.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="h-9 px-4 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300/30 text-neutral-800 rounded-lg text-xs font-bold transition-all border border-neutral-200/60 cursor-pointer shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
