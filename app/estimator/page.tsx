'use client'

import { useState } from 'react'

export default function EstimatorPage() {
  const [modules, setModules] = useState({
    kasir: false,
    inventory: false,
    laporan: false,
    auth: false,
    sms: false,
    api: false,
  })

  const modulePrices = {
    kasir: { price: 2000000, duration: 2 },
    inventory: { price: 3000000, duration: 3 },
    laporan: { price: 1500000, duration: 1 },
    auth: { price: 1000000, duration: 1 },
    sms: { price: 500000, duration: 0.5 },
    api: { price: 1500000, duration: 2 },
  }

  const toggleModule = (key: string) => {
    setModules(prev => ({
      ...prev,
      [key as keyof typeof modules]: !prev[key as keyof typeof modules],
    }))
  }

  const selectedModules = Object.entries(modules)
    .filter(([_, selected]) => selected)
    .map(([key, _]) => key)

  const totalPrice = selectedModules.reduce((sum, key) => sum + modulePrices[key as keyof typeof modulePrices].price, 0)
  const totalDuration = selectedModules.reduce((sum, key) => sum + modulePrices[key as keyof typeof modulePrices].duration, 0)

  const basePrice = 5000000
  const finalPrice = basePrice + totalPrice
  const finalDuration = 4 + totalDuration

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Estimasi Harga Proyek</h1>
          <p className="text-xl text-emerald-100">
            Hitung estimasi biaya dan durasi pengerjaan aplikasi Anda dengan fleksibel
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <div className="bg-secondary rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-8 text-primary">Pilih Modul Anda</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { key: 'kasir', label: 'Kasir Digital', price: 'Rp 2jt', duration: '2 minggu' },
                    { key: 'inventory', label: 'Inventory Management', price: 'Rp 3jt', duration: '3 minggu' },
                    { key: 'laporan', label: 'Laporan & Analytics', price: 'Rp 1,5jt', duration: '1 minggu' },
                    { key: 'auth', label: 'User Authentication', price: 'Rp 1jt', duration: '1 minggu' },
                    { key: 'sms', label: 'SMS Gateway', price: 'Rp 500rb', duration: '3 hari' },
                    { key: 'api', label: 'API Integration', price: 'Rp 1,5jt', duration: '2 minggu' },
                  ].map(({ key, label, price, duration }) => (
                    <label
                      key={key}
                      className="flex items-start gap-3 p-4 bg-white border-2 border-primary rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-5 transition"
                    >
                      <input
                        type="checkbox"
                        checked={modules[key as keyof typeof modules]}
                        onChange={() => toggleModule(key)}
                        className="mt-1 w-5 h-5 accent-primary"
                      />
                      <div>
                        <p className="font-semibold text-primary">{label}</p>
                        <p className="text-sm text-slate-500">{price} • {duration}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-primary to-accent text-white rounded-lg p-8 h-fit sticky top-24">
              <h3 className="text-2xl font-bold mb-6">Ringkasan Estimasi</h3>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">Paket Dasar</p>
                  <p className="text-2xl font-bold">Rp {finalPrice.toLocaleString('id-ID')}</p>
                </div>

                <div className="border-t border-emerald-400 pt-4">
                  <p className="text-emerald-100 text-sm mb-1">Estimasi Durasi</p>
                  <p className="text-2xl font-bold">{finalDuration} minggu</p>
                </div>
              </div>

              {selectedModules.length > 0 && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-8">
                  <p className="text-emerald-100 text-sm mb-3 font-semibold">Modul Terpilih:</p>
                  <ul className="space-y-2 text-sm">
                    {selectedModules.map(module => (
                      <li key={module} className="flex justify-between">
                        <span>• {module.charAt(0).toUpperCase() + module.slice(1)}</span>
                        <span>Rp {modulePrices[module as keyof typeof modulePrices].price.toLocaleString('id-ID')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-secondary transition">
                Hubungi Sales
              </button>

              <p className="text-center text-emerald-100 text-xs mt-4">
                *Harga dapat berubah sesuai kompleksitas & revisi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-primary">Pertanyaan Umum</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Berapa biaya termurah untuk aplikasi?',
                a: 'Paket minimum kami dimulai dari Rp 5 juta untuk layout dasar. Anda dapat menambahan modul sesuai kebutuhan.'
              },
              {
                q: 'Berapa lama proses development?',
                a: 'Durasi berkisar 4-12 minggu tergantung kompleksitas, jumlah modul, dan revisi yang Anda butuhkan.'
              },
              {
                q: 'Apakah ada maintenance setelah launch?',
                a: 'Ya, kami menyediakan paket support dan maintenance untuk memastikan aplikasi Anda terus berjalan optimal.'
              },
              {
                q: 'Apakah sistem dapat diintegrasikan dengan sistem existing?',
                a: 'Tentu, kami dapat mengintegrasikan dengan sistem atau tools yang sudah Anda gunakan.'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-primary">
                <h4 className="font-bold text-primary mb-2">{item.q}</h4>
                <p className="text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
