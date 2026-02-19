import { getSupabaseAdmin } from './supabase'
import type { ContentEntry } from './supabase'

export type ContentType = 'recetas' | 'notas_de_mar' | 'salud'

export interface ContentWithType {
  id: string
  title: string
  slug: string
  content: string
  resumen?: string
  quality_score?: number
  featured_species?: string
  image_url?: string
  images?: Array<{ url: string; caption: string }> // Change this line
  source_book?: string
  source_authors?: string
  published: boolean
  contentType: ContentType
  category?: string
}

/**
 * Get all content from all tables with pagination
 */
export async function getAllContent(
  page: number = 1,
  pageSize: number = 20,
  contentType: ContentType | 'all' = 'all',
  searchTerm: string = '',
) {
  const offset = (page - 1) * pageSize
  const tables: ContentType[] =
    contentType === 'all' ? ['recetas', 'notas_de_mar', 'salud'] : [contentType]

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const results = await Promise.all(
      tables.map(async (table) => {
        let query = (supabaseAdmin as any)
          .from(table)
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })

        if (searchTerm) {
          query = query.or(
            `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
          )
        }

        const { data, error, count } = await query.range(
          offset,
          offset + pageSize - 1,
        )

        if (error) {
          console.error(`Error fetching ${table}:`, error)
          throw error
        }

        return {
          contentType: table,
          data: data || [],
          count: count || 0,
        }
      }),
    )

    const allData: ContentWithType[] = results.flatMap(
      ({ contentType, data }) =>
        data.map((item: any) => ({ ...item, contentType })),
    )

    const totalCount = results.reduce((sum, { count }) => sum + count, 0)

    return {
      data: allData,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    }
  } catch (error) {
    console.error('Error fetching content:', error)
    return {
      data: [],
      totalCount: 0,
      page,
      pageSize,
      totalPages: 0,
    }
  }
}

/**
 * Get content by slug
 */
export async function getContentBySlug(contentType: ContentType, slug: string) {
  const supabaseAdmin = getSupabaseAdmin()

  const { data, error } = await (supabaseAdmin as any)
    .from(contentType)
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  return { ...data, contentType } as ContentWithType
}

/**
 * Update content item
 */
export async function updateContent(
  contentType: ContentType,
  id: string,
  updates: Partial<Omit<ContentEntry, 'id' | 'created_at' | 'updated_at'>>,
) {
  const supabaseAdmin = getSupabaseAdmin()

  const { error } = await (supabaseAdmin as any)
    .from(contentType)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error(`Error updating ${contentType}:`, error)
    return { success: false, error }
  }

  return { success: true }
}

/**
 * Delete content item
 */
export async function deleteContent(contentType: ContentType, id: string) {
  const supabaseAdmin = getSupabaseAdmin()

  const { error } = await (supabaseAdmin as any)
    .from(contentType)
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting ${contentType}:`, error)
    return { success: false, error }
  }

  return { success: true }
}

/**
 * Create new content item
 */
export async function createContent(
  contentType: ContentType,
  content: Omit<ContentEntry, 'created_at' | 'updated_at'>,
) {
  const supabaseAdmin = getSupabaseAdmin()

  const { data, error } = await (supabaseAdmin as any)
    .from(contentType)
    .insert(content)
    .select()
    .single()

  if (error) {
    console.error(`Error creating ${contentType}:`, error)
    return { success: false, error }
  }

  return { success: true, data }
}

/**
 * Get content statistics
 */
export async function getContentStats() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const tables: ContentType[] = ['recetas', 'notas_de_mar', 'salud']

    const results = await Promise.all(
      tables.map(async (table) => {
        const { count } = await (supabaseAdmin as any)
          .from(table)
          .select('*', { count: 'exact', head: true })

        return { contentType: table, count: count || 0 }
      }),
    )

    const stats: Record<string, number> = results.reduce(
      (acc, { contentType, count }) => {
        acc[contentType] = count
        return acc
      },
      {} as Record<string, number>,
    )

    stats.total = results.reduce((sum, { count }) => sum + count, 0)

    return stats
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { recetas: 0, notas_de_mar: 0, salud: 0, total: 0 }
  }
}
