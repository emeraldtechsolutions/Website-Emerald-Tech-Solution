'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, Users, FileText, Menu, X, LogOut } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function AdminContent() {
  const router = useRouter()
  const { user, logout } = useAuthContext()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
  }

  // Verify this is an admin user
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">❌ Access Denied</h1>
          <p className="text-slate-600 mb-6">You do not have permission to access this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Total Users', value: '24', icon: '👥', color: 'bg-blue-500' },
    { label: 'Active Projects', value: '8', icon: '📋', color: 'bg-green-500' },
    { label: 'Total Revenue', value: 'Rp 45.5M', icon: '💰', color: 'bg-yellow-500' },
    { label: 'Pending Invoices', value: '3', icon: '📄', color: 'bg-red-500' },
  ]

  const recentUsers = [
    { id: 1, name: 'Budi Santoso', email: 'budi@example.com', joinDate: '2026-02-15', status: 'Active' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti@example.com', joinDate: '2026-02-18', status: 'Active' },
    { id: 3, name: 'Rudi Hermawan', email: 'rudi@example.com', joinDate: '2026-02-19', status: 'Pending' },
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
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-600">
              👤 Admin - {user?.name || user?.email}
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
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={
            isSidebarOpen
              ? 'fixed left-0 top-16 z-40 w-64 bg-white border-r border-primary p-6 h-[calc(100vh-64px)] overflow-y-auto md:block'
              : 'hidden md:block md:w-64 bg-white border-r border-primary p-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto'
          }
        >
          <nav className="space-y-4">
            {[
              { label: 'Dashboard', icon: '📊', href: '/admin' },
              { label: 'Users Management', icon: '👥', href: '/admin/users' },
              { label: 'Projects', icon: '📋', href: '/admin/projects' },
              { label: 'Invoices', icon: '💳', href: '/admin/invoices' },
              { label: 'Analytics', icon: '📈', href: '/admin/analytics' },
              { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary transition font-medium text-primary"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-6 border-t border-primary">
            <button
              onClick={() => { setIsSidebarOpen(false); handleLogout() }}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-2">Selamat datang, {user?.name || 'Admin'}! 👋</h2>
            <p className="text-emerald-100">
              Kelola pengguna, proyek, dan invoice dari sini.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary mt-1">{stat.value}</p>
                  </div>
                  <span className="text-3xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Users Table */}
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-primary">Recent Users</h3>
              <Link
                href="/admin/users"
                className="text-primary hover:text-accent transition font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Join Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-slate-600">{user.joinDate}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/admin/users"
              className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <Users className="text-blue-600 mb-3" size={32} />
              <h4 className="font-bold text-blue-900 mb-2">Manage Users</h4>
              <p className="text-blue-700 text-sm">Add, edit, or remove users from the system</p>
            </Link>

            <Link
              href="/admin/projects"
              className="bg-green-50 border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <BarChart3 className="text-green-600 mb-3" size={32} />
              <h4 className="font-bold text-green-900 mb-2">Manage Projects</h4>
              <p className="text-green-700 text-sm">Track and manage all client projects</p>
            </Link>

            <Link
              href="/admin/invoices"
              className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <FileText className="text-purple-600 mb-3" size={32} />
              <h4 className="font-bold text-purple-900 mb-2">Manage Invoices</h4>
              <p className="text-purple-700 text-sm">Create and track invoices</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  )
}
