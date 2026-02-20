import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AIChat } from '@/components/AIChat'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Emerald Tech Solution - Solusi Aplikasi Bisnis Modern',
  description: 'Platform bisnis Emerald Tech Solution untuk digitalisasi dan efisiensi operasional dengan POS, ERP, dan sistem F&B',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="pt-16 pb-24 h-screen overflow-hidden">
            <div style={{ height: 'calc(100vh - 4rem - 6rem)' }} className="overflow-auto">
              {children}
            </div>
          </main>
          <Footer />
          <AIChat />
        </Providers>
      </body>
    </html>
  )
}

