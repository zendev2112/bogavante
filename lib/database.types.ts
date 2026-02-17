export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface FeaturedSpecies {
  bookName: string
  stockProduct: string
  categoria: string
  subcategoria: string
  presentations: string[]
  matchedIn: string
  confidence: number
}

export interface Database {
  public: {
    Tables: {
      recetas: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          resumen: string | null
          quality_score: number
          featured_species: FeaturedSpecies[]
          images: string[]
          source_book: string | null
          source_authors: string | null
          cooking_method: string | null
          preparation_time: number | null
          difficulty: string | null
          nutritional_info: Json | null
          image_url: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          resumen?: string | null
          quality_score?: number
          featured_species?: FeaturedSpecies[]
          images?: string[]
          source_book?: string | null
          source_authors?: string | null
          cooking_method?: string | null
          preparation_time?: number | null
          difficulty?: string | null
          nutritional_info?: Json | null
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          resumen?: string | null
          quality_score?: number
          featured_species?: FeaturedSpecies[]
          images?: string[]
          source_book?: string | null
          source_authors?: string | null
          cooking_method?: string | null
          preparation_time?: number | null
          difficulty?: string | null
          nutritional_info?: Json | null
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notas_de_mar: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          resumen: string | null
          quality_score: number
          featured_species: FeaturedSpecies[]
          images: string[]
          source_book: string | null
          source_authors: string | null
          cooking_method: string | null
          preparation_time: number | null
          difficulty: string | null
          nutritional_info: Json | null
          image_url: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          resumen?: string | null
          quality_score?: number
          featured_species?: FeaturedSpecies[]
          images?: string[]
          source_book?: string | null
          source_authors?: string | null
          cooking_method?: string | null
          preparation_time?: number | null
          difficulty?: string | null
          nutritional_info?: Json | null
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          resumen?: string | null
          quality_score?: number
          featured_species?: FeaturedSpecies[]
          images?: string[]
          source_book?: string | null
          source_authors?: string | null
          cooking_method?: string | null
          preparation_time?: number | null
          difficulty?: string | null
          nutritional_info?: Json | null
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      salud: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          resumen: string | null
          quality_score: number
          featured_species: FeaturedSpecies[]
          images: string[]
          source_book: string | null
          source_authors: string | null
          cooking_method: string | null
          preparation_time: number | null
          difficulty: string | null
          nutritional_info: Json | null
          image_url: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          resumen?: string | null
          quality_score?: number
          featured_species?: FeaturedSpecies[]
          images?: string[]
          source_book?: string | null
          source_authors?: string | null
          cooking_method?: string | null
          preparation_time?: number | null
          difficulty?: string | null
          nutritional_info?: Json | null
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          resumen?: string | null
          quality_score?: number
          featured_species?: FeaturedSpecies[]
          images?: string[]
          source_book?: string | null
          source_authors?: string | null
          cooking_method?: string | null
          preparation_time?: number | null
          difficulty?: string | null
          nutritional_info?: Json | null
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
