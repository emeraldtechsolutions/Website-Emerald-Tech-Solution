'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'customer'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, isInitialized } = useAuthContext()

  useEffect(() => {
    if (!isInitialized) {
      return // Still loading auth state
    }

    if (!user) {
      // Not authenticated
      router.push('/login')
      return
    }

    if (requiredRole && user.role !== requiredRole) {
      // Doesn't have required role
      if (requiredRole === 'admin') {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, isInitialized, requiredRole, router])

  // Show loading state while checking auth
  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">🟢 Emerald Tech</h1>
          <p className="text-emerald-100 mb-8">Loading...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    return null // Redirecting...
  }

  return <>{children}</>
}
