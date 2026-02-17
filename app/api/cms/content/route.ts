import { NextRequest, NextResponse } from 'next/server'
import {
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
  ContentType,
} from '@/lib/cms-queries'

// GET - Fetch content with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const contentType = searchParams.get('contentType') as ContentType | 'all'
    const searchTerm = searchParams.get('searchTerm') || ''

    const result = await getAllContent({
      page,
      pageSize,
      contentType: contentType === 'all' ? undefined : contentType,
      searchTerm: searchTerm || undefined,
      sortBy: 'updated_at',
      sortOrder: 'desc',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Error fetching content' },
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

    const result = await updateContent(id, contentType, updates)

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

    const result = await deleteContent(id, contentType)

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
