import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌')
}

// Create Supabase client with proper configuration for session persistence
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      // Enable session persistence
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Custom storage for localStorage
      storage: typeof window !== 'undefined' 
        ? window.localStorage
        : undefined,
    },
  }
)

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
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

