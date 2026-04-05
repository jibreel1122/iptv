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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const username = String(body?.username || '').trim()
    const text = String(body?.text || '').trim()
    const rating = Number(body?.rating)

    if (!username || !text || Number.isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Username, review text, and rating (1-5) are required' },
        { status: 400 }
      )
    }

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data: maxRows } = await supabase
        .from('reviews')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)

      const nextPosition = Number(maxRows?.[0]?.position || 0) + 1
      const payloads = [
        { username, rating, text, active: true, position: nextPosition },
        { username, rating, text },
      ]

      let created: any = null
      let error: any = null

      for (const payload of payloads) {
        const res = await supabase.from('reviews').insert(payload).select('*').single()
        created = res.data
        error = res.error
        if (!error) break

        const msg = String(error?.message || '').toLowerCase()
        if (!(msg.includes('column') || msg.includes('schema cache'))) {
          break
        }
      }

      if (error) {
        console.error('Create review error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
      }

      return NextResponse.json(created, { status: 201 })
    }

    if (!hasDatabase) {
      const nextId = fallbackReviews.length ? Math.max(...fallbackReviews.map((r) => r.id)) + 1 : 1
      const nextPosition = fallbackReviews.length ? Math.max(...fallbackReviews.map((r) => r.position)) + 1 : 1
      const newReview = {
        id: nextId,
        username,
        rating,
        text,
        position: nextPosition,
        active: true,
        created_at: new Date().toISOString(),
      }
      fallbackReviews.push(newReview)
      return NextResponse.json(newReview, { status: 201 })
    }

    const posRows = await sql`SELECT COALESCE(MAX(position), 0) AS max_pos FROM reviews`
    const nextPosition = Number(posRows?.[0]?.max_pos || 0) + 1

    const created = await sql`
      INSERT INTO reviews (username, rating, text, position, active)
      VALUES (${username}, ${rating}, ${text}, ${nextPosition}, true)
      RETURNING *
    `

    return NextResponse.json(created[0], { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
