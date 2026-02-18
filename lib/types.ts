export interface Oferta {
  id: string
  title: string
  description: string | null
  price: number | null
  original_price: number | null
  image_url: string | null
  active: boolean
  created_at: string
  updated_at: string
}