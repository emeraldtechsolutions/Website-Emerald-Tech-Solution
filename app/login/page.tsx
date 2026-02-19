'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulasi login
    setTimeout(() => {
      setIsLoading(false)
      // Redirect ke dashboard
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🟢 Emerald Tech</h1>
          <p className="text-emerald-100">Client Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8 border-t-4 border-primary">
          <h2 className="text-3xl font-bold text-primary mb-6">Masuk</h2>

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

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-primary" />
                <span className="text-slate-600">Ingat saya</span>
              </label>
              <Link href="#" className="text-primary hover:text-accent">
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-accent transition disabled:opacity-50"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
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

          {/* Demo Account */}
          <div className="bg-secondary rounded-lg p-4 text-center border border-primary">
            <p className="text-sm text-primary font-medium mb-3">Akun Demo (untuk testing)</p>
            <div className="space-y-1 text-xs font-mono text-slate-600 mb-3">
              <p>Email: demo@example.com</p>
              <p>Password: demo123</p>
            </div>
            <button
              onClick={() => {
                setEmail('demo@example.com')
                setPassword('demo123')
              }}
              className="text-orange-500 text-sm font-semibold hover:text-orange-600"
            >
              Gunakan Akun Demo
            </button>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Belum punya akun?{' '}
              <Link href="/signup" className="text-orange-500 font-semibold hover:text-orange-600">
                Daftar di sini
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
