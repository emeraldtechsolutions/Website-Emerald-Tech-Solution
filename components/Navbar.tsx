'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-primary">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            🟢 Emerald Tech
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-primary transition font-medium">
              Beranda
            </Link>
            <Link href="/portfolio" className="hover:text-primary transition font-medium">
              Portfolio
            </Link>
            <Link href="/estimator" className="hover:text-primary transition font-medium">
              Estimasi Harga
            </Link>
            <Link href="/docs" className="hover:text-primary transition font-medium">
              Dokumentasi
            </Link>
            <Link href="/login" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition font-medium">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link href="/" className="block hover:text-primary transition font-medium">
              Beranda
            </Link>
            <Link href="/portfolio" className="block hover:text-primary transition font-medium">
              Portfolio
            </Link>
            <Link href="/estimator" className="block hover:text-primary transition font-medium">
              Estimasi Harga
            </Link>
            <Link href="/docs" className="block hover:text-primary transition font-medium">
              Dokumentasi
            </Link>
            <Link href="/login" className="block px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition font-medium">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
