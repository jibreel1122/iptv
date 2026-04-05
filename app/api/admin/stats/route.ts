import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getAutoGrowingStats } from '@/lib/stats'
import { isAdminAuthenticated } from '@/lib/admin-session'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

async function checkAuth() {
  return isAdminAuthenticated()
}

export async function GET() {
  try {
    if (hasDatabase) {
      const stats = await sql`SELECT * FROM stats LIMIT 1`
      return NextResponse.json(getAutoGrowingStats(stats[0] || null))
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase.from('stats').select('*').limit(1).maybeSingle()

      if (error) {
        console.error('Fetch stats error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
      }

      return NextResponse.json(getAutoGrowingStats(data ?? null))
    }

    return NextResponse.json(getAutoGrowingStats(null))
  } catch (error) {
    console.error('Fetch stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { channels, movies, series } = await request.json()
    if (hasDatabase) {
      const result = await sql`
        UPDATE stats 
        SET channels = ${channels}, movies = ${movies}, series = ${series}, updated_at = NOW()
        WHERE id = 1
        RETURNING *
      `
      return NextResponse.json(result[0])
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('stats')
        .update({ channels, movies, series, updated_at: new Date().toISOString() })
        .eq('id', 1)
        .select('*')
        .single()

      if (error) {
        console.error('Update stats error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 })
      }

      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Update stats error:', error)
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 })
  }
}
