import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { fallbackOffers } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

function buildOfferTitle(duration: string) {
  const clean = String(duration || '').trim()
  return clean ? `اشتراك ${clean}` : 'اشتراك جديد'
}

export async function GET() {
  try {
    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('active', true)
        .order('position', { ascending: true })

      if (error) {
        throw error
      }

      return NextResponse.json(data || [])
    }

    if (!hasDatabase) {
      return NextResponse.json(
        [...fallbackOffers]
          .filter((offer) => offer.active)
          .sort((a, b) => a.position - b.position)
      )
    }
    const offers = await sql`
      SELECT * FROM offers WHERE active = true ORDER BY position ASC
    `
    return NextResponse.json(offers)
  } catch (error) {
    console.error('Offers API error:', error)
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { duration, price, old_price } = await request.json()
    const title = buildOfferTitle(duration)

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data: maxRows } = await supabase
        .from('offers')
        .select('position')
        .order('position', { ascending: false })
        .limit(1)

      const nextPosition = Number(maxRows?.[0]?.position || 0) + 1
      const { data, error } = await supabase
        .from('offers')
        .insert({
          title,
          duration,
          price,
          old_price: old_price || null,
          badge: null,
          position: nextPosition,
          active: true,
        })
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json(data, { status: 201 })
    }

    const posRows = await sql`SELECT COALESCE(MAX(position), 0) AS max_pos FROM offers`
    const nextPosition = Number(posRows?.[0]?.max_pos || 0) + 1
    const result = await sql`
      INSERT INTO offers (title, duration, price, old_price, badge, position)
      VALUES (${title}, ${duration}, ${price}, ${old_price || null}, ${null}, ${nextPosition})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Create offer error:', error)
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 })
  }
}
