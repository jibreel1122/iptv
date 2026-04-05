import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { fallbackFeatures } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export async function GET() {
  try {
    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('active', true)
        .order('position', { ascending: true })
      if (error) throw error
      return NextResponse.json(data || [])
    }

    if (!hasDatabase) {
      return NextResponse.json(fallbackFeatures)
    }
    const features = await sql`
      SELECT * FROM features WHERE active = true ORDER BY position ASC
    `
    return NextResponse.json(features)
  } catch (error) {
    console.error('Features API error:', error)
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
  }
}
