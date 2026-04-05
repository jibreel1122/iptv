import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getAutoGrowingStats } from '@/lib/stats'
import { fallbackStats } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export async function GET() {
  try {
    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase.from('stats').select('*').limit(1)
      if (error) throw error
      return NextResponse.json(getAutoGrowingStats(data?.[0] || fallbackStats))
    }

    if (!hasDatabase) {
      return NextResponse.json(getAutoGrowingStats(fallbackStats))
    }
    const stats = await sql`SELECT * FROM stats LIMIT 1`
    return NextResponse.json(getAutoGrowingStats(stats[0] || null))
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { channels, movies, series } = await request.json()

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data: existing, error: fetchErr } = await supabase.from('stats').select('id').limit(1)
      if (fetchErr) throw fetchErr

      if (existing?.length) {
        const { data, error } = await supabase
          .from('stats')
          .update({ channels, movies, series, updated_at: new Date().toISOString() })
          .eq('id', existing[0].id)
          .select('*')
          .single()
        if (error) throw error
        return NextResponse.json(data)
      }

      const { data, error } = await supabase
        .from('stats')
        .insert({ channels, movies, series })
        .select('*')
        .single()
      if (error) throw error
      return NextResponse.json(data)
    }

    const result = await sql`
      UPDATE stats 
      SET channels = ${channels}, movies = ${movies}, series = ${series}, updated_at = NOW()
      WHERE id = 1
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Stats update error:', error)
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 })
  }
}
