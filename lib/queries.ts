import { supabase } from './supabase'
import type { ContentEntry } from './supabase'
import type { Oferta } from './types'

// ============================================================================
// RECETAS
// ============================================================================

export async function getRecetas(
  limit: number = 10,
  publishedOnly: boolean = true,
): Promise<ContentEntry[]> {
  let query = supabase
    .from('recetas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (publishedOnly) {
    query = query.eq('published', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching recetas:', error)
    return []
  }

  return (data || []) as ContentEntry[]
}

export async function getRecetaBySlug(
  slug: string,
): Promise<ContentEntry | null> {
  const { data, error } = await supabase
    .from('recetas')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function getRecetasBySpecies(
  stockProduct: string,
): Promise<ContentEntry[]> {
  const { data, error } = await supabase
    .from('recetas')
    .select('*')
    .contains('featured_species', [{ stockProduct }])
    .order('quality_score', { ascending: false })

  if (error) throw error
  return data || []
}

// ============================================================================
// NOTAS DE MAR
// ============================================================================

export async function getNotasDeMar(
  limit: number = 10,
  publishedOnly: boolean = true,
): Promise<ContentEntry[]> {
  let query = supabase
    .from('notas_de_mar')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (publishedOnly) {
    query = query.eq('published', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching notas de mar:', error)
    return []
  }

  return (data || []) as ContentEntry[]
}

export async function getNotaDeMarBySlug(
  slug: string,
): Promise<ContentEntry | null> {
  const { data, error } = await supabase
    .from('notas_de_mar')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

// Alias for consistency
export const getNotaBySlug = getNotaDeMarBySlug

// ============================================================================
// SALUD
// ============================================================================

export async function getSaludArticles(
  limit: number = 10,
  publishedOnly: boolean = true,
): Promise<ContentEntry[]> {
  let query = supabase
    .from('salud')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (publishedOnly) {
    query = query.eq('published', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching salud articles:', error)
    return []
  }

  return (data || []) as ContentEntry[]
}

export async function getSaludBySlug(
  slug: string,
): Promise<ContentEntry | null> {
  const { data, error } = await supabase
    .from('salud')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

// Alias for consistency
export const getSaludArticleBySlug = getSaludBySlug

// ============================================================================
// CROSS-TABLE: Search by species across all tables
// ============================================================================

export async function getContentBySpecies(stockProduct: string) {
  const [recetas, notas, salud] = await Promise.all([
    supabase
      .from('recetas')
      .select('*')
      .contains('featured_species', [{ stockProduct }]),
    supabase
      .from('notas_de_mar')
      .select('*')
      .contains('featured_species', [{ stockProduct }]),
    supabase
      .from('salud')
      .select('*')
      .contains('featured_species', [{ stockProduct }]),
  ])

  return {
    recetas: recetas.data || [],
    notas_de_mar: notas.data || [],
    salud: salud.data || [],
  }
}

// ============================================================================
// Get all unique species across all content
// ============================================================================

export async function getAllSpecies(): Promise<string[]> {
  const { data, error } = await supabase
    .from('recetas')
    .select('featured_species')

  if (error || !data) return []

  const species = new Set<string>()
  data.forEach((entry: any) => {
    entry.featured_species?.forEach((s: any) => {
      species.add(s.stockProduct)
    })
  })

  return Array.from(species).sort()
}

export async function getOfertas(): Promise<Oferta[]> {
  const { data, error } = await supabase
    .from('ofertas')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching ofertas:', error)
    return []
  }
  return (data || []) as Oferta[]
}
