import { hasDatabase, sql, type ContentCategory, type ContentItem } from '@/lib/db'
import { NextResponse } from 'next/server'
import { fallbackCategories, fallbackItems } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export async function GET() {
  try {
    let categories: ContentCategory[] = fallbackCategories
    let items: ContentItem[] = fallbackItems

    if (hasDatabase) {
      categories = (await sql`
        SELECT * FROM content_categories 
        WHERE active = true 
        ORDER BY position ASC
      `) as ContentCategory[]

      items = (await sql`
        SELECT * FROM content_items 
        WHERE active = true 
        ORDER BY position ASC
      `) as ContentItem[]
    } else if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const [catRes, itemRes] = await Promise.all([
        supabase.from('content_categories').select('*').eq('active', true).order('position', { ascending: true }),
        supabase.from('content_items').select('*').eq('active', true).order('position', { ascending: true }),
      ])

      if (!catRes.error && catRes.data) categories = catRes.data as ContentCategory[]
      if (!itemRes.error && itemRes.data) items = itemRes.data as ContentItem[]
    }

    // Group items by category
    const result = categories.map(cat => ({
      ...cat,
      items: items.filter(item => item.category_id === cat.id)
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}
