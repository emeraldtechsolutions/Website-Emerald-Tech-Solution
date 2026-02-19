'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-orange-500 mb-4">404</div>
        <h1 className="text-4xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-xl text-slate-300 mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition">
            Kembali ke Beranda
          </Link>
          <Link href="/docs" className="px-8 py-3 border-2 border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-500 hover:text-white transition">
            Lihat Dokumentasi
          </Link>
        </div>
      </div>
    </div>
  )
}
