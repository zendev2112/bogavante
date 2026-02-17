import { NextRequest, NextResponse } from 'next/server'
import { getAllContent, updateContent, deleteContent } from '@/lib/cms-queries'
import type { ContentType } from '@/lib/cms-queries'

export const dynamic = 'force-dynamic'

// GET - Fetch content with filters
export async function GET(request: NextRequest) {
  try {
    console.log('=== CMS API GET Request ===')
    console.log('Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
    })

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const contentType = (searchParams.get('contentType') || 'all') as
      | ContentType
      | 'all'
    const searchTerm = searchParams.get('searchTerm') || ''

    console.log('Query params:', { page, pageSize, contentType, searchTerm })

    const result = await getAllContent(page, pageSize, contentType, searchTerm)

    console.log('Result:', {
      totalCount: result.totalCount,
      dataLength: result.data.length,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Error fetching content', details: String(error) },
      { status: 500 },
    )
  }
}

// PUT - Update content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, contentType, updates } = body

    if (!id || !contentType) {
      return NextResponse.json(
        { error: 'Missing id or contentType' },
        { status: 400 },
      )
    }

    const result = await updateContent(contentType, id, updates)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Error updating content' },
      { status: 500 },
    )
  }
}

// DELETE - Delete content
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, contentType } = body

    if (!id || !contentType) {
      return NextResponse.json(
        { error: 'Missing id or contentType' },
        { status: 400 },
      )
    }

    const result = await deleteContent(contentType, id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { error: 'Error deleting content' },
      { status: 500 },
    )
  }
}
