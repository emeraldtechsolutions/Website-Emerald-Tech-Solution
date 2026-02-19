import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET all invoices for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const status = request.nextUrl.searchParams.get('status')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('invoices')
      .select(`
        *,
        invoice_items(*),
        projects(name, type)
      `)
      .eq('user_id', userId)
      .is('deleted_at', null)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('invoice_date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, projectId, items, invoice_date, due_date, description } = body

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields or empty items' },
        { status: 400 }
      )
    }

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
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0)
    const tax = subtotal * 0.1 // 10% tax
    const totalAmount = subtotal + tax

    // Insert invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert([
        {
          user_id: userId,
          project_id: projectId,
          invoice_number: invoiceNumber,
          invoice_date: invoice_date || new Date().toISOString().split('T')[0],
          due_date,
          subtotal,
          tax,
          total_amount: totalAmount,
          description,
          status: 'draft'
        }
      ])
      .select()

    if (invoiceError) {
      return NextResponse.json({ error: invoiceError.message }, { status: 500 })
    }

    const invoiceId = invoiceData?.[0]?.id
    if (!invoiceId) {
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
    }

    // Insert invoice items
    const itemsWithInvoiceId = items.map((item: any, index: number) => ({
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

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }

    // Get created invoice with items
    const { data: fullInvoice } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items(*)
      `)
      .eq('id', invoiceId)
      .single()

    return NextResponse.json(
      {
        success: true,
        data: fullInvoice,
        invoiceNumber
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
