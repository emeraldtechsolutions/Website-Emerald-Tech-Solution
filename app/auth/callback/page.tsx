'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from URL hash
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Callback error:', error)
          router.push('/login?error=' + encodeURIComponent(error.message))
          return
        }

        if (session) {
          // Redirect to dashboard on successful auth
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error('Unexpected error:', err)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">🟢 Emerald Tech</h1>
        <p className="text-emerald-100 mb-8">Processing login...</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  )
}
