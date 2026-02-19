import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET published portfolio projects
export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category')
    const featured = request.nextUrl.searchParams.get('featured')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '12')
    const offset = parseInt(request.nextUrl.searchParams.get('offset') || '0')

    let query = supabase
      .from('portfolio_projects')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .is('deleted_at', null)

    if (category) {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      count,
      limit,
      offset
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create portfolio project (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      featuredImageUrl,
      clientName,
      features,
      technologies
    } = body

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category' },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const { data, error } = await supabase
      .from('portfolio_projects')
      .insert([
        {
          title,
          slug,
          description,
          category,
          featured_image_url: featuredImageUrl,
          client_name: clientName,
          features: features || [],
          technologies: technologies || [],
          is_published: true,
          published_at: new Date().toISOString()
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
