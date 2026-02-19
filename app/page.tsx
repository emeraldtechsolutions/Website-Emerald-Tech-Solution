'use client'

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary via-accent to-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Transformasi Digital Bisnis Anda
              </h1>
              <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
                Solusi aplikasi modern untuk UMKM: POS, ERP, dan sistem manajemen F&B yang terjangkau dan mudah digunakan.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-white text-primary hover:bg-secondary text-primary font-semibold rounded-lg transition">
                  Konsultasi Gratis
                </button>
                <button className="px-8 py-3 border-2 border-white hover:bg-white hover:text-primary text-white font-semibold rounded-lg transition">
                  Lihat Portfolio
                </button>
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-slate-300">Mockup Aplikasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Solusi Lengkap untuk Bisnis Anda
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Sistem POS',
                description: 'Sistem kasir digital yang mudah digunakan untuk toko retail dan restoran',
                icon: '🛒',
              },
              {
                title: 'Sistem ERP',
                description: 'Manajemen inventory, penjualan, dan laporan keuangan terintegrasi',
                icon: '📊',
              },
              {
                title: 'Sistem F&B',
                description: 'Manajemen pesanan, meja, dan kitchen display system untuk restoran',
                icon: '🍽️',
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-secondary rounded-lg p-8 border border-primary hover:shadow-lg transition">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-primary">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary">
            Layanan Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Konsultasi & Assessment',
                description: 'Evaluasi kebutuhan bisnis Anda dan rekomendasi solusi terbaik',
              },
              {
                title: 'Development Custom',
                description: 'Pengembangan aplikasi sesuai spesifikasi dan kebutuhan unik bisnis Anda',
              },
              {
                title: 'Training & Support',
                description: 'Pelatihan tim Anda dan support teknis berkelanjutan',
              },
              {
                title: 'Maintenance & Updates',
                description: 'Pemeliharaan sistem dan update fitur sesuai perkembangan bisnis',
              },
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8 border border-primary hover:shadow-lg transition">
                <h3 className="text-2xl font-bold mb-3 text-primary">{service.title}</h3>
                <p className="text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap Mentransformasi Bisnis Anda?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Hubungi tim kami hari ini untuk konsultasi gratis dan penawaran spesial untuk UMKM.
          </p>
          <button className="px-10 py-4 bg-white text-primary font-bold rounded-lg hover:bg-secondary transition text-lg">
            Hubungi Kami Sekarang
          </button>
        </div>
      </section>
    </div>
  )
}
