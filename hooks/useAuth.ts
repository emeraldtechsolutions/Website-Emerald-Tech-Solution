'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, ADMIN_EMAIL } from '@/lib/supabaseClient'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
  avatar?: string
  createdAt?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Cek session yang sudah ada
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
          setIsInitialized(true)
          return
        }

        if (session?.user) {
          console.log('Session found, loading profile:', session.user.email)
          await loadUserProfile(session.user)
        } else {
          console.log('No session found')
        }
        setIsInitialized(true)
      } catch (err) {
        console.error('Auth check error:', err)
        setIsInitialized(true)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const loadUserProfile = useCallback(
    async (authUser: any) => {
      try {
        // Determine role based on email
        const role = authUser.email === ADMIN_EMAIL ? 'admin' : 'customer'

        const userData: AuthUser = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          role: role,
          avatar: authUser.user_metadata?.avatar_url,
          createdAt: authUser.created_at,
        }

        setUser(userData)
      } catch (err) {
        console.error('Error loading user profile:', err)
      }
    },
    []
  )

  const loginWithGoogle = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setError(authError.message || 'Gagal login dengan Google')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        },
      })

      if (signupError) {
        console.error('Signup error:', signupError)
        setError(signupError.message || 'Gagal mendaftar')
        return false
      }

      // Log signup response untuk debugging
      console.log('Signup response:', data)

      // Jika email_confirmed_at null, berarti perlu verifikasi email
      if (data.user && !data.user.email_confirmed_at) {
        console.log('Email verification required:', data.user.email)
        // User masih perlu verifikasi email
      }

      return true
    } catch (err) {
      console.error('Signup exception:', err)
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mendaftar')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError(loginError.message || 'Email atau password salah')
        return false
      }

      if (data.user) {
        await loadUserProfile(data.user)
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat login')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { error: logoutError } = await supabase.auth.signOut()

      if (logoutError) {
        setError(logoutError.message || 'Gagal logout')
        return false
      }

      setUser(null)
      router.push('/login')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat logout')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) {
        setError(resetError.message || 'Gagal mengirim reset password')
        return false
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    error,
    isInitialized,
    loginWithGoogle,
    loginWithEmail,
    signup,
    logout,
    resetPassword,
  }
}
