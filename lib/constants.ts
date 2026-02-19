// App Constants
export const APP_CONFIG = {
  name: 'Emerald Tech Solution',
  description: 'Solusi transformasi digital untuk UMKM',
  version: '1.0.0',
  author: 'Emerald Tech Solution Team',
}

// Navigation Links
export const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Estimasi Harga', href: '/estimator' },
  { label: 'Dokumentasi', href: '/docs' },
]

// Contact Info
export const CONTACT_INFO = {
  email: 'support@emeraldtech.id',
  phone: '+62 XXX-XXXX-XXXX',
  address: 'Jakarta, Indonesia',
  workingHours: 'Senin-Jumat 09:00-17:00 WIB',
}

// Social Media
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/emeraldtech',
  instagram: 'https://instagram.com/emeraldtech',
  linkedin: 'https://linkedin.com/company/emeraldtech',
  youtube: 'https://youtube.com/@emeraldtech',
}

// Product Types
export const PRODUCT_TYPES = {
  POS: 'pos',
  ERP: 'erp',
  FNB: 'fnb',
}

// Service Types
export const SERVICE_TYPES = {
  CONSULTATION: 'consultation',
  DEVELOPMENT: 'development',
  TRAINING: 'training',
  MAINTENANCE: 'maintenance',
}

// Project Status
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold',
}

// Module Pricing
export const MODULE_PRICING = {
  kasir: { name: 'Kasir Digital', price: 2000000, duration: 2 },
  inventory: { name: 'Inventory Management', price: 3000000, duration: 3 },
  laporan: { name: 'Laporan & Analytics', price: 1500000, duration: 1 },
  auth: { name: 'User Authentication', price: 1000000, duration: 1 },
  sms: { name: 'SMS Gateway', price: 500000, duration: 0.5 },
  api: { name: 'API Integration', price: 1500000, duration: 2 },
}

// Base Pricing
export const BASE_PRICE = 5000000
export const BASE_DURATION = 4 // weeks

// Portfolio Projects (Sample Data)
export const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: 'Toko Retail Modern',
    category: 'pos',
    description: 'Sistem POS terintegrasi dengan inventory management untuk toko clothing retail',
    features: ['Kasir Digital', 'Inventory', 'Laporan Penjualan', 'Multi-user'],
  },
  {
    id: 2,
    title: 'Restoran Management',
    category: 'fnb',
    description: 'Sistem manajemen restoran lengkap dengan order tracking dan kitchen display',
    features: ['Order Management', 'KDS', 'Meja Tracking', 'Payment Gateway'],
  },
  {
    id: 3,
    title: 'Distributor Goods',
    category: 'erp',
    description: 'Sistem ERP untuk manajemen distributor dengan tracking pengiriman',
    features: ['Supply Chain', 'Warehouse', 'Delivery Tracking', 'Analytics'],
  },
]
