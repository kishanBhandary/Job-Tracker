import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Checks if Supabase has been configured with valid credentials (not placeholders)
 */
export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !!supabaseAnonKey &&
    supabaseAnonKey !== 'your-anon-key'
  )
}

/**
 * Create a Supabase client for use in browser/client components
 */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Create a Supabase client for use in server components, actions, or route handlers
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch (error) {
          // Ignore error if setAll is called from a Server Component rendering context
        }
      },
    },
  })
}
