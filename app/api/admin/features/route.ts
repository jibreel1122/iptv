import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-session'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

async function checkAuth() {
  return isAdminAuthenticated()
}

export async function GET() {
  try {
    if (hasDatabase) {
      const features = await sql`
        SELECT * FROM features ORDER BY position ASC
      `
      return NextResponse.json(features)
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase.from('features').select('*').order('position', { ascending: true })
      if (error) {
        console.error('Fetch features error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
      }
      return NextResponse.json(data ?? [])
    }

    return NextResponse.json([])
  } catch (error) {
    console.error('Fetch features error:', error)
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, description, position } = await request.json()
    if (hasDatabase) {
      const result = await sql`
        INSERT INTO features (title, description, position)
        VALUES (${title}, ${description || null}, ${position || 0})
        RETURNING *
      `
      return NextResponse.json(result[0], { status: 201 })
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('features')
        .insert({ title, description: description || null, position: position || 0 })
        .select('*')
        .single()

      if (error) {
        console.error('Create feature error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 })
      }

      return NextResponse.json(data, { status: 201 })
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Create feature error:', error)
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, title, description, active } = await request.json()
    if (hasDatabase) {
      const result = await sql`
        UPDATE features
        SET title = ${title}, description = ${description || null}, active = ${active}
        WHERE id = ${id}
        RETURNING *
      `
      return NextResponse.json(result[0])
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('features')
        .update({ title, description: description || null, active })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('Update feature error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 })
      }

      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Update feature error:', error)
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (hasDatabase) {
      await sql`
        DELETE FROM features WHERE id = ${id}
      `
      return NextResponse.json({ success: true })
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { error } = await supabase.from('features').delete().eq('id', id)
      if (error) {
        console.error('Delete feature error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Delete feature error:', error)
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 })
  }
}
