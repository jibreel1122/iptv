import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { fallbackReviews } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export async function GET() {
  try {
    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('active', true)
        .order('position', { ascending: true })
      if (error) throw error
      return NextResponse.json(data || [])
    }

    if (!hasDatabase) {
      return NextResponse.json(fallbackReviews)
    }
    const reviews = await sql`
      SELECT * FROM reviews WHERE active = true ORDER BY position ASC
    `
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
