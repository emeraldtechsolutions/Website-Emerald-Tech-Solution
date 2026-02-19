import { createClient } from '@supabase/supabase-js'

/**
 * Create Supabase client dengan service role key (server-side only)
 * Use this di API routes dan server actions
 */
export const getSupabaseServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )
}

/**
 * Get user by ID
 */
export const getUser = async (userId: string) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Get user profile dengan statistics
 */
export const getUserProfile = async (userId: string) => {
  const supabase = getSupabaseServerClient()

  const { data: userStats, error } = await supabase
    .from('vw_user_statistics')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)
  return userStats
}

/**
 * Get project details dengan modules
 */
export const getProject = async (projectId: string) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('vw_project_summary')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Get all projects dengan summary
 */
export const getUserProjects = async (userId: string) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('vw_project_summary')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

/**
 * Create new project
 */
export const createProject = async (
  userId: string,
  projectData: {
    name: string
    type: 'pos' | 'erp' | 'fnb'
    description?: string
    budget_amount?: number
    due_date?: string
  }
) => {
  const supabase = getSupabaseServerClient()

  const slug = projectData.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        user_id: userId,
        ...projectData,
        slug,
        status: 'planning',
        progress: 0
      }
    ])
    .select()

  if (error) throw new Error(error.message)
  return data?.[0]
}

/**
 * Update project
 */
export const updateProject = async (
  projectId: string,
  updates: Record<string, any>
) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()

  if (error) throw new Error(error.message)
  return data?.[0]
}

/**
 * Get invoices dengan items
 */
export const getInvoices = async (userId: string, status?: string) => {
  const supabase = getSupabaseServerClient()

  let query = supabase
    .from('invoices')
    .select(`
      *,
      invoice_items(*)
    `)
    .eq('user_id', userId)
    .is('deleted_at', null)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query.order('invoice_date', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

/**
 * Get single invoice dengan items
 */
export const getInvoice = async (invoiceId: string) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      invoice_items(*),
      projects(name, type)
    `)
    .eq('id', invoiceId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

/**
 * Create invoice dengan items
 */
export const createInvoice = async (
  userId: string,
  invoiceData: {
    projectId?: string
    items: Array<{
      description: string
      quantity: number
      unit_price: number
    }>
    due_date: string
    description?: string
  }
) => {
  const supabase = getSupabaseServerClient()

  // Generate invoice number
  const year = new Date().getFullYear().toString().slice(-2)
  const month = String(new Date().getMonth() + 1).padStart(2, '0')

  const { data: existingInvoices } = await supabase
    .from('invoices')
    .select('invoice_number')
    .like('invoice_number', `INV-${year}${month}-%`)

  const counter = (existingInvoices?.length || 0) + 1
  const invoiceNumber = `INV-${year}${month}-${String(counter).padStart(5, '0')}`

  // Calculate totals
  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  )
  const tax = subtotal * 0.1
  const totalAmount = subtotal + tax

  // Insert invoice
  const { data: invoiceResult, error: invoiceError } = await supabase
    .from('invoices')
    .insert([
      {
        user_id: userId,
        project_id: invoiceData.projectId,
        invoice_number: invoiceNumber,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: invoiceData.due_date,
        subtotal,
        tax,
        total_amount: totalAmount,
        description: invoiceData.description,
        status: 'draft'
      }
    ])
    .select()

  if (invoiceError) throw new Error(invoiceError.message)

  const invoiceId = invoiceResult?.[0]?.id
  if (!invoiceId) throw new Error('Failed to create invoice')

  // Insert items
  const itemsWithInvoiceId = invoiceData.items.map((item, index) => ({
    invoice_id: invoiceId,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.quantity * item.unit_price,
    order_index: index
  }))

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(itemsWithInvoiceId)

  if (itemsError) throw new Error(itemsError.message)

  // Get full invoice
  return getInvoice(invoiceId)
}

/**
 * Log activity untuk audit trail
 */
export const logActivity = async (
  userId: string | null,
  action: string,
  resourceType: string,
  resourceId?: string,
  changes?: Record<string, any>
) => {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('activity_logs')
    .insert([
      {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        changes: changes || {}
      }
    ])

  if (error) console.error('Failed to log activity:', error.message)
}

/**
 * Get portfolio projects
 */
export const getPortfolioProjects = async (
  filters?: {
    category?: string
    featured?: boolean
    limit?: number
    offset?: number
  }
) => {
  const supabase = getSupabaseServerClient()

  const limit = filters?.limit || 12
  const offset = filters?.offset || 0

  let query = supabase
    .from('portfolio_projects')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .is('deleted_at', null)

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.featured) {
    query = query.eq('featured', true)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)

  return {
    data,
    count,
    limit,
    offset
  }
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (userId: string) => {
  const supabase = getSupabaseServerClient()

  const { data: stats, error } = await supabase
    .from('vw_user_statistics')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)

  return {
    totalProjects: stats?.total_projects || 0,
    activeProjects: stats?.active_projects || 0,
    totalInvoices: stats?.total_invoices || 0,
    totalInvoiceAmount: stats?.total_invoice_amount || 0,
    paidInvoices: stats?.paid_invoices || 0
  }
}
