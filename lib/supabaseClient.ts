// Supabase Client Configuration
// TODO: Implement with actual Supabase project
// This is a placeholder for future implementation

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}

// Example of how to create Supabase client:
/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default supabase
*/

export const tables = {
  users: 'users',
  projects: 'projects',
  invoices: 'invoices',
  modules: 'modules',
  portfolio: 'portfolio_projects',
}
