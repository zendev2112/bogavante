import { supabaseAdmin } from './supabase'
import { ContentEntry } from './supabase'

// Type for content across all tables
export type ContentType = 'recetas' | 'salud' | 'notas_de_mar'

export interface ContentWithType extends ContentEntry {
  contentType: ContentType
}

// ============================================================================
// CMS QUERIES - For admin panel
// ============================================================================

/**
 * Get all content from all tables with pagination
 */
export async function getAllContent(options?: {
  page?: number
  pageSize?: number
  contentType?: ContentType
  searchTerm?: string
  sortBy?: 'created_at' | 'updated_at' | 'quality_score' | 'title'
  sortOrder?: 'asc' | 'desc'
}): Promise<{ data: ContentWithType[]; total: number }> {
  const {
    page = 1,
    pageSize = 20,
    contentType,
    searchTerm,
    sortBy = 'updated_at',
    sortOrder = 'desc',
  } = options || {}

  const tables: ContentType[] = contentType
    ? [contentType]
    : ['recetas', 'salud', 'notas_de_mar']

  const allResults: ContentWithType[] = []
  let totalCount = 0

  for (const table of tables) {
    let query = supabaseAdmin.from(table).select('*', { count: 'exact' })

    // Search filter
    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`,
      )
    }

    // Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const { data, error, count } = await query

    if (error) {
      console.error(`Error fetching from ${table}:`, error)
      continue
    }

    if (data) {
      const dataWithType = data.map((item: any) => ({
        ...item,
        contentType: table as ContentType,
      }))
      allResults.push(...dataWithType)
      totalCount += count || 0
    }
  }

  // Client-side pagination after combining all tables
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedResults = allResults.slice(start, end)

  return {
    data: paginatedResults,
    total: totalCount,
  }
}

/**
 * Get single content entry by ID and type
 */
export async function getContentById(
  id: string,
  contentType: ContentType,
): Promise<ContentWithType | null> {
  const { data, error } = await supabaseAdmin
    .from(contentType)
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return { ...(data as ContentEntry), contentType }
}

/**
 * Update content entry
 */
export async function updateContent(
  id: string,
  contentType: ContentType,
  updates: Partial<ContentEntry>,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from(contentType)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Delete content entry
 */
export async function deleteContent(
  id: string,
  contentType: ContentType,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin.from(contentType).delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Create new content entry
 */
export async function createContent(
  contentType: ContentType,
  content: Omit<ContentEntry, 'created_at' | 'updated_at'>,
): Promise<{ success: boolean; error?: string; id?: string }> {
  const { data, error } = await supabaseAdmin
    .from(contentType)
    .insert(content)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, id: data?.id }
}

/**
 * Get content statistics
 */
export async function getContentStats() {
  const tables: ContentType[] = ['recetas', 'salud', 'notas_de_mar']
  const stats: Record<ContentType, number> = {
    recetas: 0,
    salud: 0,
    notas_de_mar: 0,
  }

  for (const table of tables) {
    const { count } = await supabaseAdmin
      .from(table)
      .select('*', { count: 'exact', head: true })
    stats[table] = count || 0
  }

  return stats
}
