'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { user, isLoading, error: authError, signup, loginWithGoogle } = useAuthContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Nama harus diisi'
    if (!formData.email.trim()) newErrors.email = 'Email harus diisi'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email tidak valid'
    if (formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)

    if (!validateForm()) {
      return
    }

    const success = await signup(formData.email, formData.password, formData.name)
    
    if (success) {
      setSuccessMessage('Pendaftaran berhasil! Silakan check email Anda untuk verifikasi.')
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle()
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Signup Google gagal' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-slate-900 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🟢 Emerald Tech</h1>
          <p className="text-emerald-100">Daftar Akun Baru</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8 border-t-4 border-primary">
          <h2 className="text-3xl font-bold text-primary mb-6">Buat Akun Baru</h2>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <p className="text-sm font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Error Alert */}
          {(authError || errors.submit) && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="text-sm font-semibold">{authError || errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-primary mb-2">
                Nama Lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama Anda"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-red-500' : 'border-primary'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="anda@example.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-red-500' : 'border-primary'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? 'border-red-500' : 'border-primary'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary mb-2">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.confirmPassword ? 'border-red-500' : 'border-primary'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" id="terms" className="mt-1 accent-primary" required />
              <label htmlFor="terms" className="text-slate-600 text-sm">
                Saya setuju dengan{' '}
                <Link href="#" className="text-primary hover:text-accent">
                  Syarat & Ketentuan
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-accent transition disabled:opacity-50 mt-6"
            >
              {isLoading ? 'Mendaftar...' : 'Daftar dengan Email'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-primary font-medium">atau</span>
            </div>
          </div>

          {/* Google Signup Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full py-3 bg-white text-slate-700 font-semibold rounded-lg border-2 border-slate-300 hover:bg-slate-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Daftar dengan Google
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary font-semibold hover:text-accent">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-emerald-100 text-sm">
          <p>Butuh bantuan? Hubungi support@emeraldtech.id</p>
        </div>
      </div>
    </div>
  )
}
