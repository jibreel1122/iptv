import { neon } from '@neondatabase/serverless'

export const hasDatabase = Boolean(process.env.DATABASE_URL)

const sqlStub = async () => {
  throw new Error('DATABASE_URL is not set')
}

export const sql = hasDatabase ? neon(process.env.DATABASE_URL as string) : (sqlStub as any)

// Type definitions
export interface Stats {
  id: number
  channels: number
  movies: number
  series: number
  updated_at: string
}

export interface Setting {
  id: number
  key: string
  value: string
  type: string
  label: string
  category: string
  updated_at: string
}

export interface Offer {
  id: number
  title: string
  duration: string
  price: number
  old_price?: number
  badge?: string
  sales_counter: number
  features?: string[]
  position: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Feature {
  id: number
  title: string
  description: string
  icon?: string
  position: number
  active: boolean
  created_at: string
}

export interface ContentCategory {
  id: number
  name: string
  description: string
  icon?: string
  position: number
  active: boolean
  created_at: string
}

export interface ContentItem {
  id: number
  category_id: number
  title: string
  description?: string
  poster_url?: string
  thumbnail_url?: string
  year?: string
  rating?: string
  position: number
  active: boolean
  created_at: string
}

export interface Review {
  id: number
  username: string
  avatar_url?: string
  rating: number
  text: string
  country?: string
  position: number
  active: boolean
  created_at: string
}

export interface Order {
  id: number
  full_name?: string
  whatsapp_number: string
  offer_id?: number
  offer_title?: string
  offer_price?: number
  message?: string
  status: string
  created_at: string
}

export interface Theme {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
  particle_color?: string
  particle_shape?: string
  particle_count: number
  particle_speed: number
  glow_color?: string
  is_default: boolean
  position: number
  active: boolean
  created_at: string
}

export interface AdminUser {
  id: number
  email: string
  password_hash: string
  name?: string
  created_at: string
  last_login?: string
}

export interface Image {
  id: number
  url: string
  alt_text?: string
  category?: string
  filename?: string
  size?: number
  mime_type?: string
  created_at: string
}
