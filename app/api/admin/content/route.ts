import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-session'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

async function checkAuth() {
  return isAdminAuthenticated()
}

async function ensureSchema() {
  await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS description TEXT`
  await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS year VARCHAR(10)`
  await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS rating VARCHAR(10)`
  await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS thumbnail_url TEXT`
}

export async function GET() {
  try {
    if (hasDatabase) {
      await ensureSchema()

      const items = await sql`
        SELECT ci.*, cc.name AS category_name
        FROM content_items ci
        LEFT JOIN content_categories cc ON cc.id = ci.category_id
        ORDER BY ci.position ASC
      `
      const categories = await sql`SELECT * FROM content_categories ORDER BY position ASC`

      return NextResponse.json({ items, categories })
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const [itemsRes, categoriesRes] = await Promise.all([
        supabase.from('content_items').select('*').order('position', { ascending: true }),
        supabase.from('content_categories').select('*').order('position', { ascending: true }),
      ])

      if (itemsRes.error || categoriesRes.error) {
        console.error('Fetch content error (Supabase):', itemsRes.error || categoriesRes.error)
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
      }

      const categories = categoriesRes.data ?? []
      const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]))
      const items = (itemsRes.data ?? []).map((item: any) => ({
        ...item,
        category_name: categoryMap.get(item.category_id) ?? null,
      }))

      return NextResponse.json({ items, categories })
    }

    return NextResponse.json({ items: [], categories: [] })
  } catch (error) {
    console.error('Fetch content error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { category_id, title, description, poster_url, thumbnail_url, year, rating, position } = await request.json()

    if (hasDatabase) {
      await ensureSchema()
      const result = await sql`
        INSERT INTO content_items (category_id, title, description, poster_url, thumbnail_url, year, rating, position)
        VALUES (${category_id}, ${title}, ${description || null}, ${poster_url || null}, ${thumbnail_url || null}, ${year || null}, ${rating || null}, ${position || 0})
        RETURNING *
      `

      return NextResponse.json(result[0], { status: 201 })
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('content_items')
        .insert({
          category_id,
          title,
          description: description || null,
          poster_url: poster_url || null,
          thumbnail_url: thumbnail_url || null,
          year: year || null,
          rating: rating || null,
          position: position || 0,
        })
        .select('*')
        .single()

      if (error) {
        console.error('Create content error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to create content item' }, { status: 500 })
      }

      return NextResponse.json(data, { status: 201 })
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Create content error:', error)
    return NextResponse.json({ error: 'Failed to create content item' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, category_id, title, description, poster_url, thumbnail_url, year, rating, active } = await request.json()

    if (hasDatabase) {
      await ensureSchema()
      const result = await sql`
        UPDATE content_items
        SET
          category_id = ${category_id},
          title = ${title},
          description = ${description || null},
          poster_url = ${poster_url || null},
          thumbnail_url = ${thumbnail_url || null},
          year = ${year || null},
          rating = ${rating || null},
          active = ${active}
        WHERE id = ${id}
        RETURNING *
      `

      return NextResponse.json(result[0])
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('content_items')
        .update({
          category_id,
          title,
          description: description || null,
          poster_url: poster_url || null,
          thumbnail_url: thumbnail_url || null,
          year: year || null,
          rating: rating || null,
          active,
        })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('Update content error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to update content item' }, { status: 500 })
      }

      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Update content error:', error)
    return NextResponse.json({ error: 'Failed to update content item' }, { status: 500 })
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
      await sql`DELETE FROM content_items WHERE id = ${id}`
      return NextResponse.json({ success: true })
    }

    if (hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { error } = await supabase.from('content_items').delete().eq('id', id)
      if (error) {
        console.error('Delete content error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to delete content item' }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'No database configured' }, { status: 500 })
  } catch (error) {
    console.error('Delete content error:', error)
    return NextResponse.json({ error: 'Failed to delete content item' }, { status: 500 })
  }
}
