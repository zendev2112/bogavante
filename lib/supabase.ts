import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Cached admin client instance
let adminClient: ReturnType<typeof createClient<Database>> | null = null

// Admin client getter - creates client only when called
export function getSupabaseAdmin() {
  if (adminClient) return adminClient

  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceKey || !url) {
    console.error('Missing Supabase environment variables:', {
      hasServiceKey: !!serviceKey,
      hasUrl: !!url,
    })
    throw new Error('Missing Supabase admin credentials')
  }

  adminClient = createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}

// Export a getter function instead of direct client
export function getAdmin() {
  return getSupabaseAdmin()
}

// For backward compatibility, create a property that always returns fresh client
export const supabaseAdmin = new Proxy(
  {} as ReturnType<typeof createClient<Database>>,
  {
    get(target, prop) {
      const client = getSupabaseAdmin()
      return (client as any)[prop]
    },
  },
)

export type ContentEntry = Database['public']['Tables']['recetas']['Row']
