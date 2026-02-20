'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 border-b-2 border-primary">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
        <div className="flex justify-between items-center w-full">
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
          <div className="md:hidden absolute left-0 right-0 top-full mt-0 bg-white px-6 py-4 space-y-4 z-50 shadow-md">
            <Link href="/" onClick={() => setIsOpen(false)} className="block hover:text-primary transition font-medium">
              Beranda
            </Link>
            <Link href="/portfolio" onClick={() => setIsOpen(false)} className="block hover:text-primary transition font-medium">
              Portfolio
            </Link>
            <Link href="/estimator" onClick={() => setIsOpen(false)} className="block hover:text-primary transition font-medium">
              Estimasi Harga
            </Link>
            <Link href="/docs" onClick={() => setIsOpen(false)} className="block hover:text-primary transition font-medium">
              Dokumentasi
            </Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="block px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition font-medium">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
