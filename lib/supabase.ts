import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// For server-side operations (imports, admin actions)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

// Types matching your Supabase tables
export interface ContentEntry {
  id: string
  title: string
  slug: string
  content: string
  quality_score: number
  image_url: string | null // ← ADDED
  featured_species: FeaturedSpecies[]
  source_book: string
  source_authors: string[]
  source_publisher: string
  source_year: string
  source_page: number | null
  language: string
  created_at: string
  updated_at: string
}

export interface FeaturedSpecies {
  bookName: string
  stockProduct: string
  categoria: string
  subcategoria: string
  presentations: string[]
  matchedIn: string
  confidence: number
}
