import { supabaseAdmin, ContentEntry } from './supabase'

export type ContentType = 'recetas' | 'notas_de_mar' | 'salud'

export type ContentWithType = ContentEntry & {
  contentType: ContentType
}

// ============================================================================
// CMS QUERIES - For admin panel
// ============================================================================

/**
 * Get all content from all tables with pagination
 */
export async function getAllContent(
  page: number = 1,
  pageSize: number = 20,
  contentType: ContentType | 'all' = 'all',
  searchTerm: string = ''
) {
  const offset = (page - 1) * pageSize
  const tables: ContentType[] = contentType === 'all' 
    ? ['recetas', 'notas_de_mar', 'salud']
    : [contentType]

  try {
    const results = await Promise.all(
      tables.map(async (table) => {
        let query = (supabaseAdmin
          .from(table) as any)
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })

        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        }

        const { data, error, count } = await query.range(offset, offset + pageSize - 1)

        if (error) throw error

        return {
          contentType: table,
          data: data || [],
          count: count || 0,
        }
      })
    )

    const allData: ContentWithType[] = results.flatMap(({ contentType, data }) =>
      data.map((item: any) => ({ ...item, contentType }))
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
 * Get single content entry by ID and type
 */
export async function getContentById(
  id: string,
  contentType: ContentType,
): Promise<ContentWithType | null> {
  const { data, error } = await (supabaseAdmin
    .from(contentType) as any)
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return { ...(data as any), contentType } as ContentWithType
}

/**
 * Update content entry
 */
export async function updateContent(
  contentType: ContentType,
  id: string,
  updates: Partial<ContentEntry>,
) {
  const updateData = {
    ...updates,
    updated_at: new Date().toISOString(),
  }
  const { error } = await (supabaseAdmin
    .from(contentType) as any)
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error(`Error updating ${contentType}:`, error)
    return { success: false, error }
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
  const { error } = await (supabaseAdmin.from(contentType) as any).delete().eq('id', id)

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
  content: Partial<ContentEntry>,
): Promise<{ success: boolean; error?: string; id?: string }> {
  const { data, error } = await (supabaseAdmin
    .from(contentType) as any)
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
    const { count } = await (supabaseAdmin
      .from(table) as any)
      .select('*', { count: 'exact', head: true })
    stats[table] = count || 0
  }

  return stats
}
