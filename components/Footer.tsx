'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white md:py-12 py-0 fixed md:static bottom-0 left-0 right-0 h-24 md:h-auto z-40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Desktop / tablet footer */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">🟢 Emerald Tech</h3>
            <p className="text-slate-400">
              Solusi transformasi digital untuk UMKM dengan teknologi terkini dan harga terjangkau.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-primary">Produk</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="#" className="hover:text-primary transition">Sistem POS</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Sistem ERP</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Sistem F&B</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-primary">Perusahaan</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="#" className="hover:text-primary transition">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Karir</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-primary">Kontak</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Email: info@emeraldtech.id</li>
              <li>Phone: +62 XXX-XXXX-XXXX</li>
              <li className="flex gap-4 mt-4">
                <Link href="#" className="hover:text-primary transition">Facebook</Link>
                <Link href="#" className="hover:text-primary transition">Instagram</Link>
                <Link href="#" className="hover:text-primary transition">LinkedIn</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile compact footer (fixed) */}
        <div className="md:hidden h-24 flex items-center justify-between px-4">
          <div>
            <h3 className="text-lg font-bold text-primary">🟢 Emerald Tech</h3>
            <p className="text-slate-400 text-sm">&copy; {currentYear}</p>
          </div>
          <div className="text-right">
            <Link href="#" className="text-slate-400 hover:text-primary text-sm">Kontak</Link>
          </div>
        </div>

        <div className="hidden md:block border-t border-primary pt-8 text-center text-slate-400">
          <p>&copy; {currentYear} Emerald Tech Solution. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
