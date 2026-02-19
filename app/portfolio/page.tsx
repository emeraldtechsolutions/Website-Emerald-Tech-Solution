'use client'

import { useState } from 'react'

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('semua')

  const projects = [
    {
      id: 1,
      title: 'Toko Retail Modern',
      category: 'pos',
      description: 'Sistem POS terintegrasi dengan inventory management untuk toko clothing retail',
      image: '🏪',
      features: ['Kasir Digital', 'Inventory', 'Laporan Penjualan', 'Multi-user'],
    },
    {
      id: 2,
      title: 'Restoran Management',
      category: 'fnb',
      description: 'Sistem manajemen restoran lengkap dengan order tracking dan kitchen display',
      image: '🍽️',
      features: ['Order Management', 'KDS', 'Meja Tracking', 'Payment Gateway'],
    },
    {
      id: 3,
      title: 'Distributor Goods',
      category: 'erp',
      description: 'Sistem ERP untuk manajemen distributor dengan tracking pengiriman',
      image: '📦',
      features: ['Supply Chain', 'Warehouse', 'Delivery Tracking', 'Analytics'],
    },
    {
      id: 4,
      title: 'Kafe Minimalis',
      category: 'pos',
      description: 'POS system untuk kafe dengan menu customization',
      image: '☕',
      features: ['Menu Builder', 'Loyalty Program', 'Analytics', 'Offline Mode'],
    },
    {
      id: 5,
      title: 'E-Commerce',
      category: 'erp',
      description: 'Platform e-commerce dengan inventory sync real-time',
      image: '🛍️',
      features: ['Product Management', 'Multi-Channel', 'Payment Integration', 'Marketing Tools'],
    },
    {
      id: 6,
      title: 'Hotel Management',
      category: 'fnb',
      description: 'Sistem manajemen hotel dengan booking dan staff management',
      image: '🏨',
      features: ['Reservasi', 'Room Management', 'Staff Scheduling', 'Guest Services'],
    },
  ]

  const filteredProjects = activeCategory === 'semua'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Portfolio Proyeknya</h1>
          <p className="text-xl text-emerald-100">
            Lihat berbagai solusi sukses yang telah kami implementasikan untuk klien-klien kami.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-primary">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-4">
            {['semua', 'pos', 'erp', 'fnb'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {cat === 'semua' && 'Semua'}
                {cat === 'pos' && 'Sistem POS'}
                {cat === 'erp' && 'Sistem ERP'}
                {cat === 'fnb' && 'Sistem F&B'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <div key={project.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition border border-primary">
                <div className="bg-secondary h-48 flex items-center justify-center text-8xl">
                  {project.image}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">{project.title}</h3>
                  <p className="text-slate-600 mb-4">{project.description}</p>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-secondary text-primary rounded-full text-sm font-medium border border-primary"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-accent transition font-semibold">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-secondary">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Tertarik dengan solusi kami?
          </h2>
          <p className="text-primary mb-6">
            Hubungi tim kami untuk diskusi lebih lanjut tentang kebutuhan bisnis Anda.
          </p>
          <button className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-accent transition">
            Minta Konsultasi
          </button>
        </div>
      </section>
    </div>
  )
}
