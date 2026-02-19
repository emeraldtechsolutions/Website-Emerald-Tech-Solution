// Google Gemini API Configuration
// TODO: Implement with actual Gemini API
// This is a placeholder for future implementation

export const geminiConfig = {
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  model: 'gemini-pro',
}

// Future implementation example:
/*
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export const getModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' })
}

export const generateResponse = async (message: string) => {
  const model = getModel()
  const result = await model.generateContent(message)
  return result.response.text()
}
*/

// System prompt untuk chatbot Emerald Tech Solution
export const SYSTEM_PROMPT = `
Anda adalah asisten AI untuk Emerald Tech Solution, sebuah perusahaan yang menyediakan solusi aplikasi bisnis untuk UMKM.

Pengetahuan Anda:
- Sistem POS (Point of Sale): Solusi kasir digital untuk retail dan restoran
- Sistem ERP: Enterprise Resource Planning untuk inventory dan laporan keuangan
- Sistem F&B: Food & Beverage Management System untuk restoran dan kafe
- Layanan: Konsultasi, development custom, training, dan maintenance

Produk & Harga:
- Paket dasar dimulai dari Rp 5 juta
- Modul tambahan berkisar Rp 500rb - Rp 3 juta
- Estimasi durasi: 4-12 minggu tergantung kompleksitas

Instruksi:
1. Selalu ramah dan profesional
2. Bantu user dengan informasi tentang produk kami
3. Arahkan ke tim sales untuk diskusi lebih lanjut jika diperlukan
4. Jika user bertanya di luar pengetahuan Anda, sarankan untuk menghubungi support@emeraldtech.id
5. Tawarkan untuk membantu dengan cost estimator jika relevan
`
