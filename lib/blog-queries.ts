import { supabase, ContentEntry } from './supabase'
import { ContentType } from './cms-queries'

// ============================================================================
// PUBLIC BLOG QUERIES
// ============================================================================

export interface BlogPost extends ContentEntry {
  contentType: ContentType
  excerpt?: string
}

/**
 * Get all published blog posts from all content types
 */
export async function getAllBlogPosts(options?: {
  limit?: number
  offset?: number
  contentType?: ContentType
}): Promise<BlogPost[]> {
  const { limit = 12, offset = 0, contentType } = options || {}

  const tables: ContentType[] = contentType
    ? [contentType]
    : ['recetas', 'salud', 'notas_de_mar']

  const allPosts: BlogPost[] = []

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('quality_score', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error(`Error fetching from ${table}:`, error)
      continue
    }

    if (data) {
      const postsWithType = data.map((item) => ({
        ...item,
        contentType: table as ContentType,
        excerpt: generateExcerpt(item.content),
      }))
      allPosts.push(...postsWithType)
    }
  }

  // Sort by quality score and date
  return allPosts
    .sort((a, b) => {
      if (b.quality_score !== a.quality_score) {
        return b.quality_score - a.quality_score
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    .slice(0, limit)
}

/**
 * Get a single blog post by slug and content type
 */
export async function getBlogPostBySlug(
  slug: string,
  contentType?: ContentType,
): Promise<BlogPost | null> {
  const tables: ContentType[] = contentType
    ? [contentType]
    : ['recetas', 'salud', 'notas_de_mar']

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('slug', slug)
      .single()

    if (data && !error) {
      return {
        ...data,
        contentType: table as ContentType,
        excerpt: generateExcerpt(data.content),
      }
    }
  }

  return null
}

/**
 * Get featured blog posts (highest quality)
 */
export async function getFeaturedPosts(limit = 6): Promise<BlogPost[]> {
  return getAllBlogPosts({ limit })
}

/**
 * Get recent blog posts
 */
export async function getRecentPosts(limit = 10): Promise<BlogPost[]> {
  const tables: ContentType[] = ['recetas', 'salud', 'notas_de_mar']
  const allPosts: BlogPost[] = []

  for (const table of tables) {
    const { data } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (data) {
      allPosts.push(
        ...data.map((item) => ({
          ...item,
          contentType: table as ContentType,
          excerpt: generateExcerpt(item.content),
        })),
      )
    }
  }

  return allPosts
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, limit)
}

/**
 * Get posts by species
 */
export async function getPostsBySpecies(
  species: string,
  limit = 10,
): Promise<BlogPost[]> {
  const tables: ContentType[] = ['recetas', 'salud', 'notas_de_mar']
  const allPosts: BlogPost[] = []

  for (const table of tables) {
    const { data } = await supabase
      .from(table)
      .select('*')
      .contains('featured_species', [{ stockProduct: species }])
      .order('quality_score', { ascending: false })
      .limit(limit)

    if (data) {
      allPosts.push(
        ...data.map((item) => ({
          ...item,
          contentType: table as ContentType,
          excerpt: generateExcerpt(item.content),
        })),
      )
    }
  }

  return allPosts.slice(0, limit)
}

/**
 * Search posts
 */
export async function searchPosts(
  query: string,
  limit = 20,
): Promise<BlogPost[]> {
  const tables: ContentType[] = ['recetas', 'salud', 'notas_de_mar']
  const allPosts: BlogPost[] = []

  for (const table of tables) {
    const { data } = await supabase
      .from(table)
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('quality_score', { ascending: false })
      .limit(limit)

    if (data) {
      allPosts.push(
        ...data.map((item) => ({
          ...item,
          contentType: table as ContentType,
          excerpt: generateExcerpt(item.content),
        })),
      )
    }
  }

  return allPosts.slice(0, limit)
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(content: string, length = 200): string {
  const cleaned = content.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()

  if (cleaned.length <= length) return cleaned

  return cleaned.substring(0, length).trim() + '...'
}

/**
 * Get content type label
 */
export function getContentTypeLabel(contentType: ContentType): string {
  const labels: Record<ContentType, string> = {
    recetas: 'Receta',
    salud: 'Salud',
    notas_de_mar: 'Notas de Mar',
  }
  return labels[contentType] || contentType
}

/**
 * Get content type color
 */
export function getContentTypeColor(contentType: ContentType): string {
  const colors: Record<ContentType, string> = {
    recetas: 'bg-orange-500',
    salud: 'bg-green-500',
    notas_de_mar: 'bg-blue-500',
  }
  return colors[contentType] || 'bg-gray-500'
}
