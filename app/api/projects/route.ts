import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Create Supabase client with service role key (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET all projects for authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
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

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, type, description, budget_amount, due_date } = body

    if (!userId || !name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, type' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: userId,
          name,
          slug,
          type,
          description,
          budget_amount: budget_amount || 0,
          due_date,
          status: 'planning',
          progress: 0
        }
      ])
      .select()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data?.[0]
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
