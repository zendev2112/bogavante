import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// For server-side operations (imports, admin actions)
// Lazy-loaded to ensure env vars are available at runtime
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

const getSupabaseAdmin = () => {
  if (_supabaseAdmin) return _supabaseAdmin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  _supabaseAdmin = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return _supabaseAdmin
}

// Export a proxy that lazily initializes the admin client
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseAdmin()
    const value = client[prop as keyof typeof client]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

// Types matching your Supabase tables
export interface ContentEntry {
  id: string
  title: string
  slug: string
  content: string
  resumen: string | null
  quality_score: number
  image_url: string | null
  featured_species: FeaturedSpecies[]
  source_book: string
  source_authors: string[]
  source_publisher: string
  source_year: string
  source_page: number | null
  language: string
  created_at: string
  updated_at: string
  published: boolean
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
