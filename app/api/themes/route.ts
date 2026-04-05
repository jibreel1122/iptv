import { hasDatabase, sql, type Theme } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export async function GET() {
  try {
    if (hasDatabase) {
      const result = await sql`
        SELECT * FROM themes 
        WHERE active = true 
        ORDER BY position ASC
      `
      return NextResponse.json(result as Theme[])
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('active', true)
        .order('position', { ascending: true })

      if (error) {
        console.error('Error fetching themes from Supabase:', error)
        return NextResponse.json([])
      }

      return NextResponse.json((data ?? []) as Theme[])
    }

    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    )
  }
}
