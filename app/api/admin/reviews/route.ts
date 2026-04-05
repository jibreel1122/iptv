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
      const reviews = await sql`
        SELECT * FROM reviews ORDER BY position ASC
      `
      return NextResponse.json(reviews)
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase.from('reviews').select('*').order('position', { ascending: true })
      if (error) {
        console.error('Fetch reviews error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
      }
      return NextResponse.json(data ?? [])
    }

    return NextResponse.json([])
  } catch (error) {
    console.error('Fetch reviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { username, rating, text, position } = await request.json()
    if (hasDatabase) {
      const result = await sql`
        INSERT INTO reviews (username, rating, text, position)
        VALUES (${username}, ${rating}, ${text}, ${position || 0})
        RETURNING *
      `
      return NextResponse.json(result[0], { status: 201 })
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('reviews')
        .insert({ username, rating, text, position: position || 0 })
        .select('*')
        .single()

      if (error) {
        console.error('Create review error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
      }

      return NextResponse.json(data, { status: 201 })
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, username, rating, text, active } = await request.json()
    if (hasDatabase) {
      const result = await sql`
        UPDATE reviews
        SET username = ${username}, rating = ${rating}, text = ${text}, active = ${active}
        WHERE id = ${id}
        RETURNING *
      `
      return NextResponse.json(result[0])
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('reviews')
        .update({ username, rating, text, active })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('Update review error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
      }

      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Update review error:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
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
        DELETE FROM reviews WHERE id = ${id}
      `
      return NextResponse.json({ success: true })
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { error } = await supabase.from('reviews').delete().eq('id', id)
      if (error) {
        console.error('Delete review error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
