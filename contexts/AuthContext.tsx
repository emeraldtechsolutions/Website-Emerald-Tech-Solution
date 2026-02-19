'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthUser } from '@/hooks/useAuth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, fullName: string) => Promise<boolean>
  logout: () => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
