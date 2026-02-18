import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { ContentType } from '@/lib/cms-queries'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')
  const contentType = searchParams.get('contentType') || 'all'
  const searchTerm = searchParams.get('searchTerm') || ''

  const supabase = getSupabaseClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    const tables: ContentType[] =
      contentType === 'all'
        ? ['recetas', 'notas_de_mar', 'salud']
        : [contentType as ContentType]

    const results = await Promise.all(
      tables.map(async (table) => {
        let query = supabase
          .from(table)
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })

        if (searchTerm) {
          query = query.or(
            `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
          )
        }

        const { data, error, count } = await query.range(from, to)

        if (error) throw error

        return {
          data:
            data?.map((item) => ({
              ...item,
              contentType: table,
            })) || [],
          count: count || 0,
        }
      }),
    )

    const allData = results.flatMap((r) => r.data)
    const totalCount = results.reduce((sum, r) => sum + r.count, 0)

    return NextResponse.json({
      data: allData,
      totalCount,
      page,
      pageSize,
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, contentType, updates } = body

    const supabase = getSupabaseClient()

    const updatePayload = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from(contentType)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content', details: error },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, contentType } = body

    const supabase = getSupabaseClient()

    const { error } = await supabase.from(contentType).delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 },
    )
  }
}
