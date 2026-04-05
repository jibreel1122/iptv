import { hasDatabase, sql, type Setting } from '@/lib/db'
import { NextResponse } from 'next/server'
import { fallbackSettingsRows } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export async function GET() {
  try {
    let result: Setting[] = fallbackSettingsRows

    if (hasDatabase) {
      result = (await sql`SELECT * FROM settings ORDER BY category, key`) as Setting[]
    } else if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('category', { ascending: true })
        .order('key', { ascending: true })
      if (!error && data) {
        result = data as Setting[]
      }
    }

    const settings: Record<string, string> = {}
    result.forEach((s: Setting) => {
      settings[s.key] = s.value
    })
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
