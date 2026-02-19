'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...')
        
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Get session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log('📊 Session check:', { hasSession: !!session, error: sessionError })

        if (sessionError) {
          console.error('❌ Callback error:', sessionError)
          setError(sessionError.message || 'Authentication failed')
          setIsProcessing(false)
          return
        }

        if (session?.user) {
          console.log('✅ Session found, user:', session.user.email)
          
          // Wait for user profile to be created by trigger
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Get user role from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()
          
          if (userError) {
            console.warn('⚠️ Could not get user role:', userError)
            // Default to dashboard for customer
            router.push('/dashboard')
            return
          }
          
          const userRole = userData?.role || 'customer'
          console.log('👤 User role:', userRole)
          
          // Redirect based on role
          if (userRole === 'admin') {
            console.log('🎯 Redirecting admin to /admin...')
            router.push('/admin')
          } else {
            console.log('🎯 Redirecting customer to /dashboard...')
            router.push('/dashboard')
          }
        } else {
          console.warn('⚠️ No session found, redirecting to login')
          router.push('/login')
        }
      } catch (err) {
        console.error('❌ Unexpected error:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        setIsProcessing(false)
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Error</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">🟢 Emerald Tech</h1>
        <p className="text-emerald-100 mb-8">Processing authentication...</p>
        {isProcessing && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        <p className="text-emerald-100 text-sm">Please wait, do not close this page...</p>
      </div>
    </div>
  )
}
