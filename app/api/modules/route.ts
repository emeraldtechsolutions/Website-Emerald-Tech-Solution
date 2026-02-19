import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET all modules for a project
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true })

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

// POST create new module
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, name, description, estimatedDuration, dueDate } = body

    if (!projectId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, name' },
        { status: 400 }
      )
    }

    // Get current max order_index
    const { data: maxOrder } = await supabase
      .from('modules')
      .select('order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: false })
      .limit(1)
      .single()

    const orderIndex = (maxOrder?.order_index || 0) + 1

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const { data, error } = await supabase
      .from('modules')
      .insert([
        {
          project_id: projectId,
          name,
          slug,
          description,
          estimated_duration: estimatedDuration,
          due_date: dueDate,
          status: 'pending',
          progress: 0,
          order_index: orderIndex
        }
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
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
