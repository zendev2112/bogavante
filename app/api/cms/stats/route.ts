import { NextResponse } from 'next/server'
import { getContentStats } from '@/lib/cms-queries'

export async function GET() {
  try {
    const stats = await getContentStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 })
  }
}
