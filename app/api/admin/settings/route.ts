import { NextResponse } from 'next/server'
import { hasDatabase, sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/admin-session'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, value } = await request.json()

    if (!id || !value) {
      return NextResponse.json(
        { error: 'ID and value are required' },
        { status: 400 }
      )
    }

    if (hasDatabase) {
      const result = await sql`
        UPDATE settings
        SET value = ${value}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `

      return NextResponse.json(result[0], { status: 200 })
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('[v0] Settings update error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
      }

      return NextResponse.json(data, { status: 200 })
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('[v0] Settings update error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
