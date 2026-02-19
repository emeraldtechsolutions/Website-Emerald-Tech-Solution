import { createClient } from '@supabase/supabase-js'

// Create Supabase client for browser
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}

// Email khusus admin
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@emeraldtech.com'

export const tables = {
  users: 'users',
  projects: 'projects',
  invoices: 'invoices',
  modules: 'modules',
  portfolio: 'portfolio_projects',
}
