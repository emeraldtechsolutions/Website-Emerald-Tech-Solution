'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, DollarSign, Clock, AlertCircle, Download, Menu, X, LogOut } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function DashboardContent() {
  const router = useRouter()
  const { user, logout } = useAuthContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
  }

  const projectProgress = [
    { id: 1, name: 'Aplikasi POS Toko A', progress: 75, status: 'In Progress', dueDate: '2026-03-15' },
    { id: 2, name: 'Sistem ERP Distributor B', progress: 30, status: 'In Progress', dueDate: '2026-04-20' },
  ]

  const invoices = [
    { id: 1, number: 'INV-2026-001', date: '2026-02-01', amount: 5000000, status: 'Paid' },
    { id: 2, number: 'INV-2026-002', date: '2026-02-15', amount: 3000000, status: 'Paid' },
    { id: 3, number: 'INV-2026-003', date: '2026-02-19', amount: 2000000, status: 'Pending' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40 border-b border-primary">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-primary"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-600">
              {user?.role === 'admin' && '👤 Admin - '}
              {user?.name || user?.email}
            </span>
            <button 
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition"
            >
              👤 Profile
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 bg-white border-r border-primary p-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="space-y-4">
              {[
                { label: 'Beranda', icon: '🏠', href: '/dashboard' },
                { label: 'Proyek Saya', icon: '📋', href: '/dashboard' },
                { label: 'Pembayaran', icon: '💳', href: '/dashboard' },
                { label: 'Dokumentasi', icon: '📚', href: '/docs' },
                { label: 'Support', icon: '🆘', href: '#' },
                { label: 'Pengaturan', icon: '⚙️', href: '/profile' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition font-medium text-primary"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Admin Section */}
            {user?.role === 'admin' && (
              <div className="mt-8 pt-6 border-t border-primary">
                <p className="text-xs font-bold text-primary mb-3 uppercase">Admin Panel</p>
                <nav className="space-y-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition font-medium text-primary"
                  >
                    <span>⚡</span>
                    <span>Admin Dashboard</span>
                  </Link>
                </nav>
              </div>
            )}

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-primary">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Keluar
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome & Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 shadow border-t-4 border-primary">
              <div className="flex justify-between items-start mb-4">
                <DollarSign className="text-primary" size={24} />
                <span className="text-2xl">📈</span>
              </div>
              <p className="text-slate-600 text-sm">Total Investasi</p>
              <p className="text-3xl font-bold text-primary">Rp 10jt</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-t-4 border-accent">
              <div className="flex justify-between items-start mb-4">
                <BarChart3 className="text-accent" size={24} />
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-slate-600 text-sm">Proyek Aktif</p>
              <p className="text-3xl font-bold text-accent">2</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-t-4 border-primary">
              <div className="flex justify-between items-start mb-4">
                <Clock className="text-primary" size={24} />
                <span className="text-2xl">⏰</span>
              </div>
              <p className="text-slate-600 text-sm">Total Durasi</p>
              <p className="text-3xl font-bold text-primary">24 minggu</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow border-t-4 border-yellow-500">
              <div className="flex justify-between items-start mb-4">
                <AlertCircle className="text-yellow-500" size={24} />
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-slate-600 text-sm">Status Overall</p>
              <p className="text-3xl font-bold text-primary">On Track</p>
            </div>
          </div>

          {/* Project Tracking */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-2xl font-bold text-primary mb-6">Tracking Proyek</h2>

            <div className="space-y-6">
              {projectProgress.map(project => (
                <div key={project.id} className="border-l-4 border-primary pl-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-primary">{project.name}</h3>
                      <p className="text-sm text-slate-500">Deadline: {project.dueDate}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm font-semibold">
                      {project.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{project.progress}% Selesai</p>
                </div>
              ))}
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-2xl font-bold text-primary mb-6">Invoice & Pembayaran</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary border-b border-primary">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-primary">No. Invoice</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Tanggal</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Jumlah</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary">
                  {invoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-secondary">
                      <td className="px-4 py-3 text-slate-900 font-medium">{invoice.number}</td>
                      <td className="px-4 py-3 text-slate-600">{invoice.date}</td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        Rp {invoice.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          invoice.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="flex items-center gap-2 text-primary hover:text-accent font-semibold">
                          <Download size={18} /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

