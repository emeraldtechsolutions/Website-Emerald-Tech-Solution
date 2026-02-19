1. Tech Stack
Pilihan ini menjamin skalabilitas tinggi dengan biaya operasional hampir Rp0 (menggunakan free tier).
 * Frontend: Next.js 14+ (App Router) & TypeScript.
 * Styling: Tailwind CSS + Shadcn UI (untuk komponen dashboard yang profesional).
 * Backend & Database: Supabase (PostgreSQL, Auth, Edge Functions).
 * AI Integration: Google Gemini API (Free Tier via AI Studio).
 * Deployment: Vercel (Sinkronisasi otomatis dengan GitHub).
   
2. Struktur Arsitektur Website
Organisasi folder untuk memastikan kode rapi dan mudah dikelola oleh AI:
/emerald-tech-web
├── /app                # Route & Page (Home, Dashboard, Portfolio, Docs)
├── /components         # UI Reusable (Navbar, Footer, CostEstimator, ServiceCard)
├── /lib                # Config utama (supabaseClient.ts, geminiConfig.ts)
├── /hooks              # Logika kustom (useAuth, useEstimation)
├── /types              # Definisi tipe data TypeScript (Database & UI)
└── /public             # Aset statis (Logo, Mockup Portofolio)

3. Product Requirement Document (PRD)
A. Ringkasan & Tujuan
Membangun platform bisnis untuk Emerald Tech Solution yang berfungsi sebagai etalase jasa pembuatan aplikasi (POS, ERP, F&B) dan pusat manajemen klien.

B. Target Audiens
 * Pemilik UMKM yang butuh digitalisasi kasir (POS).
 * Manajer operasional bisnis kecil yang butuh efisiensi (ERP).
 * Pengusaha F&B yang butuh sistem manajemen pesanan.
   
C. Fitur Utama & Alur Kerja
 * AI Chatbot (Gemini Free): Menjawab pertanyaan teknis & konsultasi awal 24/7.
 * Interactive Cost Estimator: Input: Pilihan modul (Kasir, Inventory, Laporan) -> Output: Estimasi harga & durasi pengerjaan.
 * Portfolio Showcase: Galeri interaktif menampilkan mockup aplikasi POS/ERP yang dikembangkan dengan bantuan AI.
 * Documentation Portal: Knowledge base (Markdown-based) berisi panduan teknis untuk klien.
 * Client Dashboard:
   * Login via Supabase Auth.
   * Project Tracking: Progress bar pengerjaan aplikasi.
   * Billing: List invoice PDF yang bisa diunduh.
