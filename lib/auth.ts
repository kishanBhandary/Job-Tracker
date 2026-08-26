import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { isSupabaseConfigured, createSupabaseServerClient } from './supabase'
import { encrypt, decrypt, hashPassword, verifyPassword } from './crypto'

export interface AuthUser {
  id: string
  supabaseUserId: string
  name: string
  email: string
  avatarUrl: string | null
  passwordHash?: string | null
  createdAt: Date
  updatedAt: Date
}

const SESSION_COOKIE_NAME = 'jobtrack_session'

/**
 * Sign up a new user. Supports both Supabase and PostgreSQL mock fallback.
 */
export async function signUpUser(email: string, password: string, name: string) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient()
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        })

        if (error) {
          return { error: error.message }
        }

        const supabaseUser = data.user
        if (supabaseUser) {
          const hashedPassword = hashPassword(password)
          // Create or update local user record in PostgreSQL
          const user = await prisma.user.upsert({
            where: { email },
            update: { supabaseUserId: supabaseUser.id, name, passwordHash: hashedPassword },
            create: {
              supabaseUserId: supabaseUser.id,
              email,
              name,
              passwordHash: hashedPassword,
            },
          })
          return { success: true, user }
        }
        return { error: 'Failed to retrieve Supabase user after sign up.' }
      }
    }

    // Mock Auth Fallback
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: 'An account with this email already exists.' }
    }

    const hashedPassword = hashPassword(password)
    const mockSupabaseId = crypto.randomUUID()

    const user = await prisma.user.create({
      data: {
        supabaseUserId: mockSupabaseId,
        email,
        name,
        passwordHash: hashedPassword,
      },
    })

    // Establish session cookie
    const sessionData = JSON.stringify({ userId: user.id })
    const encryptedSession = encrypt(sessionData)

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true, user }
  } catch (error: any) {
    console.error('Sign up error:', error)
    return { error: error.message || 'An unexpected error occurred during registration.' }
  }
}

/**
 * Sign in an existing user.
 */
export async function signInUser(email: string, password: string) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient()
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          return { error: error.message }
        }

        const supabaseUser = data.user
        if (supabaseUser) {
          const hashedPassword = hashPassword(password)
          // Sync with local DB
          const user = await prisma.user.upsert({
            where: { email },
            update: { supabaseUserId: supabaseUser.id, passwordHash: hashedPassword },
            create: {
              supabaseUserId: supabaseUser.id,
              email,
              name: supabaseUser.user_metadata?.name || email.split('@')[0] || 'User',
              passwordHash: hashedPassword,
            },
          })
          return { success: true, user }
        }
        return { error: 'Failed to retrieve Supabase user after sign in.' }
      }
    }

    // Mock Auth Fallback
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.passwordHash) {
      return { error: 'Invalid email or password.' }
    }

    const isPasswordValid = verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return { error: 'Invalid email or password.' }
    }

    // Establish session cookie
    const sessionData = JSON.stringify({ userId: user.id })
    const encryptedSession = encrypt(sessionData)

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true, user }
  } catch (error: any) {
    console.error('Sign in error:', error)
    return { error: error.message || 'An unexpected error occurred during sign in.' }
  }
}

/**
 * Sign out the current user.
 */
export async function signOutUser() {
  try {
    // Clear mock auth cookie
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)

    // Clear Supabase session if configured
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Sign out error:', error)
    return { error: 'Failed to log out.' }
  }
}

/**
 * Retrieve the current authenticated user profile from PostgreSQL.
 * Safe to call from Server Components (reads cookies, does not set them).
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (sessionCookie?.value) {
      const decrypted = decrypt(sessionCookie.value)
      if (decrypted) {
        const { userId } = JSON.parse(decrypted)
        if (userId) {
          const user = await prisma.user.findUnique({
            where: { id: userId },
          })
          if (user) return user
        }
      }
    }

    // Fallback or primary check for Supabase
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient()
      if (supabase) {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (supabaseUser) {
          const user = await prisma.user.findUnique({
            where: { supabaseUserId: supabaseUser.id },
          })
          
          if (user) return user

          // Auto-sync profile if not present locally
          const newUser = await prisma.user.create({
            data: {
              supabaseUserId: supabaseUser.id,
              email: supabaseUser.email || '',
              name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            },
          })
          return newUser
        }
      }
    }

    return null
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Update user profile settings (name)
 */
export async function updateProfile(name: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
    })

    return { success: true, user: updatedUser }
  } catch (error: any) {
    console.error('Update profile error:', error)
    return { error: error.message || 'Failed to update profile.' }
  }
}

/**
 * Change user password.
 */
export async function changePassword(newPassword: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { error: 'Unauthorized' }
    }

    if (isSupabaseConfigured() && !user.passwordHash) {
      const supabase = await createSupabaseServerClient()
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        })
        if (error) {
          return { error: error.message }
        }
        return { success: true }
      }
    }

    // Mock/Fallback or local password update
    const hashedPassword = hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Change password error:', error)
    return { error: error.message || 'Failed to update password.' }
  }
}

/**
 * Send password reset link.
 */
export async function sendPasswordResetLink(email: string) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient()
      if (supabase) {
        // Use window origin for redirect URL if we were in the browser, 
        // but in Server Action we use process.env.NEXT_PUBLIC_SITE_URL or standard origin.
        const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/dashboard/settings`,
        })
        if (error) {
          return { error: error.message }
        }
        return { success: true }
      }
    }

    // For mock auth, password reset is simulated.
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: 'No account found with this email.' }
    }

    // Simulate sending email
    return { 
      success: true, 
      message: '[MOCK AUTH] Password reset link sent successfully! (In development, you can use the Settings page to change password)' 
    }
  } catch (error: any) {
    console.error('Password reset error:', error)
    return { error: error.message || 'Failed to send reset link.' }
  }
}
