import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        error: 'Missing environment variables',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
      },
      { status: 500 },
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')
  const contentType = searchParams.get('contentType') || 'all'
  const searchTerm = searchParams.get('searchTerm') || ''

  try {
    const tables =
      contentType === 'all'
        ? ['recetas', 'notas_de_mar', 'salud']
        : [contentType]

    // Fetch ALL rows - NO .range() here
    const results = await Promise.all(
      tables.map(async (table) => {
        let query = supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false })

        if (searchTerm) {
          query = query.or(
            `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
          )
        }

        const { data, error } = await query

        if (error) {
          console.error(`Error fetching ${table}:`, error)
          return { table, data: [] }
        }

        return { table, data: data || [] }
      }),
    )

    // Combine all tables
    const allData = results.flatMap(({ table, data }) =>
      data.map((d) => ({ ...d, contentType: table })),
    )

    // Sort by created_at
    allData.sort(
      (a, b) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime(),
    )

    // Total count BEFORE paginating
    const totalCount = allData.length

    // Paginate AFTER combining
    const from = (page - 1) * pageSize
    const paginated = allData.slice(from, from + pageSize)

    return NextResponse.json({
      data: paginated,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { id, contentType, originalContentType, updates } = body

    if (!id || !contentType) {
      return NextResponse.json(
        { error: 'Missing id or contentType' },
        { status: 400 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const validColumns = {
      recetas: [
        'title',
        'slug',
        'content',
        'resumen',
        'quality_score',
        'featured_species',
        'image_url',
        'images',
        'source_book',
        'source_authors',
        'source_publisher',
        'source_year',
        'source_page',
        'language',
        'cooking_method',
        'category',
        'published',
        'tags',
      ],
      notas_de_mar: [
        'title',
        'slug',
        'content',
        'resumen',
        'quality_score',
        'featured_species',
        'image_url',
        'images',
        'source_book',
        'source_authors',
        'source_publisher',
        'source_year',
        'source_page',
        'language',
        'category',
        'published',
        'tags',
      ],
      salud: [
        'title',
        'slug',
        'content',
        'resumen',
        'quality_score',
        'featured_species',
        'image_url',
        'images',
        'source_book',
        'source_authors',
        'source_publisher',
        'source_year',
        'source_page',
        'language',
        'category',
        'published',
        'tags',
      ],
    }

    const cleanUpdates: Record<string, any> = {}
    const validCols =
      validColumns[contentType as keyof typeof validColumns] || []
    Object.keys(updates).forEach((key) => {
      if (validCols.includes(key)) cleanUpdates[key] = updates[key]
    })

    if (originalContentType && originalContentType !== contentType) {
      const { data: originalData, error: fetchError } = await supabase
        .from(originalContentType)
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError || !originalData) {
        return NextResponse.json(
          { error: 'Could not find original record' },
          { status: 404 },
        )
      }

      const { error: insertError } = await supabase.from(contentType).insert([
        {
          ...originalData,
          ...cleanUpdates,
          updated_at: new Date().toISOString(),
        },
      ])

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 },
        )
      }

      const { error: deleteError } = await supabase
        .from(originalContentType)
        .delete()
        .eq('id', id)

      if (deleteError) {
        return NextResponse.json(
          { error: deleteError.message },
          { status: 500 },
        )
      }

      return NextResponse.json({ success: true, moved: true })
    }

    const { data, error } = await supabase
      .from(contentType)
      .update({ ...cleanUpdates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { id, contentType } = await request.json()

  const { error } = await supabase.from(contentType).delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
