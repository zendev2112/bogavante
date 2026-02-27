import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Debug: log environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    urlValue: supabaseUrl,
    keyLength: supabaseKey?.length,
  })

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

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    const [recetas, notas, salud] = await Promise.all([
      supabase.from('recetas').select('*').range(from, to),
      supabase.from('notas_de_mar').select('*').range(from, to),
      supabase.from('salud').select('*').range(from, to),
    ])

    const allData = [
      ...(recetas.data || []).map((d) => ({ ...d, contentType: 'recetas' })),
      ...(notas.data || []).map((d) => ({ ...d, contentType: 'notas_de_mar' })),
      ...(salud.data || []).map((d) => ({ ...d, contentType: 'salud' })),
    ]

    return NextResponse.json({
      data: allData,
      totalCount: allData.length,
      page,
      pageSize,
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

    // Define valid columns per table
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
      ],
    }
    // Filter updates to only valid columns
    const cleanUpdates: Record<string, any> = {}
    const validCols =
      validColumns[contentType as keyof typeof validColumns] || []

    Object.keys(updates).forEach((key) => {
      if (validCols.includes(key)) {
        cleanUpdates[key] = updates[key]
      }
    })

    // If content type changed, need to move the record
    if (originalContentType && originalContentType !== contentType) {
      // Get the original record
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

      // Create new record in new table
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

      // Delete from old table
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

    // Normal update within same table
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
