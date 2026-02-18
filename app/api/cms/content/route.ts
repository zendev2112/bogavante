import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  try {
    // Just get all from all tables
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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { id, contentType, updates } = await request.json()

  const { error } = await supabase
    .from(contentType)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { id, contentType } = await request.json()

  const { error } = await supabase.from(contentType).delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
