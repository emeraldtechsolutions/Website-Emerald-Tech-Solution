'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function DocsPage() {
  const [expandedSection, setExpandedSection] = useState('getting-started')

  const sections = {
    'getting-started': {
      title: 'Memulai',
      content: [
        {
          title: 'Pengenalan Sistem',
          content: 'Sistem kami dirancang untuk kemudahan penggunaan maksimal. Setiap fitur telah dioptimalkan untuk workflow bisnis Anda.'
        },
        {
          title: 'Akses Awal',
          content: 'Anda akan menerima akun login dan password melalui email. Gunakan kredensial ini untuk mengakses dashboard admin.'
        },
        {
          title: 'Setup Awal',
          content: '1. Login ke dashboard\n2. Lengkapi profil perusahaan\n3. Tambahkan pengguna tim\n4. Konfigurasi setting dasar'
        },
      ]
    },
    'pos-system': {
      title: 'Sistem POS',
      content: [
        {
          title: 'Dashboard Kasir',
          content: 'Dashboard kasir menampilkan antarmuka sederhana untuk penjualan harian. Semua transaksi dicatat otomatis dengan laporan real-time.'
        },
        {
          title: 'Manajemen Produk',
          content: 'Kelola stok produk, harga, dan kategori dari menu dashboard. Perubahan harga otomatis tersinkronisasi ke semua terminal kasir.'
        },
        {
          title: 'Laporan Penjualan',
          content: 'Lihat laporan penjualan harian, mingguan, atau bulanan dengan breakdown per kategori dan jam operasional.'
        },
      ]
    },
    'erp-system': {
      title: 'Sistem ERP',
      content: [
        {
          title: 'Manajemen Inventory',
          content: 'Pantau stok real-time, atur reorder level otomatis, dan kelola warehouse gudang dengan mudah.'
        },
        {
          title: 'Pembelian & Penjualan',
          content: 'Buat purchase order, kelola supplier, dan track pengiriman barang masuk dan keluar.'
        },
        {
          title: 'Laporan Keuangan',
          content: 'Generate laporan keuangan, analisis profit margin, dan forecast penjualan berdasarkan data historical.'
        },
      ]
    },
    'fnb-system': {
      title: 'Sistem F&B',
      content: [
        {
          title: 'Order Management',
          content: 'Management order lengkap dari meja, kitchen display system, hingga delivery tracking.'
        },
        {
          title: 'Menu Builder',
          content: 'Buat menu dengan foto, deskripsi, harga, dan kategori. Update harga dan availability kapan saja.'
        },
        {
          title: 'Meja & Reservasi',
          content: 'Kelola meja restoran, block table untuk maintenance, dan terima reservasi online.'
        },
      ]
    },
    'support': {
      title: 'Support & FAQ',
      content: [
        {
          title: 'Jam Support',
          content: 'Tim support kami siap membantu Senin-Jumat pukul 09:00-17:00 WIB. Untuk emergency, hubungi: +62 XXX-XXXX-XXXX'
        },
        {
          title: 'Cara Menghubungi Support',
          content: 'Hubungi kami via email (support@emeraldtech.id), telepon, atau chat dalam aplikasi dashboard.'
        },
        {
          title: 'Troubleshooting Umum',
          content: 'Jika mengalami masalah login, coba clear browser cache. Jika masalah persisten, hubungi tim support kami.'
        },
      ]
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Dokumentasi</h1>
          <p className="text-xl text-emerald-100">
            Panduan lengkap penggunaan sistem Emerald Tech Solution
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-2 sticky top-24">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setExpandedSection(key)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    expandedSection === key
                      ? 'bg-primary text-white font-semibold'
                      : 'hover:bg-secondary text-primary'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {Object.entries(sections).map(([key, section]) => (
              <div key={key} className={expandedSection === key ? '' : 'hidden'}>
                <h2 className="text-4xl font-bold mb-8 text-primary">{section.title}</h2>

                <div className="space-y-6">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="bg-secondary rounded-lg p-6 border border-primary">
                      <h3 className="text-2xl font-bold text-primary mb-3">{item.title}</h3>
                      <p className="text-slate-600 whitespace-pre-line">{item.content}</p>
                    </div>
                  ))}
                </div>

                {/* Related Resources */}
                <div className="mt-12 bg-secondary rounded-lg p-6 border-l-4 border-primary">
                  <h4 className="font-bold text-primary mb-3">💡 Tips & Trik</h4>
                  <ul className="text-primary space-y-2">
                    <li>• Manfaatkan fitur export untuk backup data regular</li>
                    <li>• Gunakan shortcut keyboard untuk input lebih cepat</li>
                    <li>• Atur notifikasi untuk yang penting di settings</li>
                    <li>• Periksa video tutorial di channel YouTube kami</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-12 bg-secondary border-t border-primary">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Tidak menemukan jawaban?
          </h2>
          <p className="text-primary mb-6">
            Tim support kami siap membantu Anda 24/7
          </p>
          <button className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-accent transition">
            Hubungi Support
          </button>
        </div>
      </section>
    </div>
  )
}
