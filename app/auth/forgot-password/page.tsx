'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { isLoading, error: authError, resetPassword } = useAuthContext()
  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)

    if (!email.trim()) {
      setLocalError('Email harus diisi')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Email tidak valid')
      return
    }

    const success = await resetPassword(email)
    if (success) {
      setSuccessMessage('Link reset password telah dikirim ke email Anda. Silakan check email.')
      setEmail('')
    } else {
      setLocalError(authError || 'Gagal mengirim reset password')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🟢 Emerald Tech</h1>
          <p className="text-emerald-100">Reset Password</p>
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8 border-t-4 border-primary">
          <h2 className="text-3xl font-bold text-primary mb-6">Lupa Password?</h2>

          <p className="text-slate-600 text-sm mb-6">
            Masukkan email Anda dan kami akan mengirimkan link untuk reset password.
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <p className="text-sm font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Error Alert */}
          {(localError || authError) && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="text-sm font-semibold">{localError || authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anda@example.com"
                className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-accent transition disabled:opacity-50"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              <Link href="/login" className="text-primary font-semibold hover:text-accent">
                Kembali ke Login
              </Link>
            </p>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Butuh bantuan? Hubungi support@emeraldtech.id</p>
        </div>
      </div>
    </div>
  )
}
