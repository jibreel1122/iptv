import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-session'
import { fallbackOffers } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

function getSupabaseErrorMessage(error: any, fallback: string) {
  const message = error?.message || fallback
  if (String(message).toLowerCase().includes('row-level security') || error?.code === '42501') {
    return 'Supabase permission error (RLS). Run the updated init-db.sql script to apply required permissions.'
  }
  return message
}

async function checkAuth() {
  return isAdminAuthenticated()
}

async function ensureOfferSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS offers (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      duration VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      old_price DECIMAL(10,2),
      badge VARCHAR(100),
      sales_counter INTEGER DEFAULT 0,
      position INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS old_price DECIMAL(10,2)`
  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS badge VARCHAR(100)`
  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS sales_counter INTEGER DEFAULT 0`
  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0`
  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true`
  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`
  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`
}

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
        .order('position', { ascending: true })
      if (error) {
        throw error
      }
      return NextResponse.json(data || [])
    }

    if (!hasDatabase) {
      const localOffers = [...fallbackOffers].sort((a, b) => a.position - b.position)
      return NextResponse.json(localOffers)
    }
    await ensureOfferSchema()
    const offers = await sql`
      SELECT * FROM offers ORDER BY position ASC
    `
    return NextResponse.json(offers)
  } catch (error) {
    console.error('Fetch offers error:', error)
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { duration, price, old_price } = await request.json()
    if (!duration || !String(duration).trim()) {
      return NextResponse.json({ error: 'Duration is required' }, { status: 400 })
    }
    const numericPrice = Number(price)
    const numericOldPrice = old_price == null || old_price === '' ? null : Number(old_price)
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 })
    }

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
          duration: String(duration),
          price: numericPrice,
          old_price: numericOldPrice || null,
          badge: null,
          position: nextPosition,
          active: true,
        })
        .select('*')
        .single()

      if (error) {
        console.error('Create offer error (Supabase):', error)
        return NextResponse.json(
          { error: getSupabaseErrorMessage(error, 'Failed to create offer') },
          { status: 500 }
        )
      }

      return NextResponse.json(data, { status: 201 })
    }

    if (!hasDatabase) {
      const now = new Date().toISOString()
      const nextId = fallbackOffers.length ? Math.max(...fallbackOffers.map((offer) => offer.id)) + 1 : 1
      const nextPosition = fallbackOffers.length ? Math.max(...fallbackOffers.map((offer) => offer.position)) + 1 : 1
      const localOffer = {
        id: nextId,
        title,
        duration: String(duration),
        price: numericPrice,
        old_price: numericOldPrice ?? undefined,
        badge: undefined,
        sales_counter: 0,
        features: undefined,
        position: nextPosition,
        active: true,
        created_at: now,
        updated_at: now,
      }
      fallbackOffers.push(localOffer)
      return NextResponse.json(localOffer, { status: 201 })
    }

    await ensureOfferSchema()
    const posRows = await sql`SELECT COALESCE(MAX(position), 0) AS max_pos FROM offers`
    const nextPosition = Number(posRows?.[0]?.max_pos || 0) + 1
    const result = await sql`
      INSERT INTO offers (title, duration, price, old_price, badge, position)
      VALUES (${title}, ${duration}, ${numericPrice}, ${numericOldPrice || null}, ${null}, ${nextPosition})
      RETURNING *
    `
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Create offer error:', error)
    return NextResponse.json({ error: getSupabaseErrorMessage(error, 'Failed to create offer') }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, duration, price, old_price, sales_counter, active } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Offer id is required' }, { status: 400 })
    }

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data: current, error: fetchError } = await supabase
        .from('offers')
        .select('*')
        .eq('id', Number(id))
        .limit(1)
      if (fetchError) throw fetchError
      if (!current || !current.length) {
        return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
      }

      const existingOffer = current[0] as any
      const nextDuration = duration ?? existingOffer.duration
      const nextTitle = buildOfferTitle(nextDuration)
      const nextPrice = price == null ? Number(existingOffer.price) : Number(price)
      if (Number.isNaN(nextPrice) || nextPrice <= 0) {
        return NextResponse.json({ error: 'Valid price is required' }, { status: 400 })
      }

      const nextOldPrice = old_price == null || old_price === '' ? null : Number(old_price)
      const { data, error } = await supabase
        .from('offers')
        .update({
          title: nextTitle,
          duration: nextDuration,
          price: nextPrice,
          old_price: nextOldPrice,
          badge: null,
          sales_counter: sales_counter ?? existingOffer.sales_counter ?? 0,
          active: active ?? existingOffer.active ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', Number(id))
        .select('*')
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    if (!hasDatabase) {
      const index = fallbackOffers.findIndex((offer) => offer.id === Number(id))
      if (index === -1) {
        return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
      }

      const current = fallbackOffers[index]
      const nextDuration = duration ?? current.duration
      const nextTitle = buildOfferTitle(nextDuration)
      const nextPrice = price == null ? current.price : Number(price)
      if (Number.isNaN(nextPrice) || nextPrice <= 0) {
        return NextResponse.json({ error: 'Valid price is required' }, { status: 400 })
      }

      const nextOldPrice = old_price == null || old_price === '' ? null : Number(old_price)
      const updated = {
        ...current,
        title: nextTitle,
        duration: nextDuration,
        price: nextPrice,
        old_price: nextOldPrice ?? undefined,
        badge: undefined,
        sales_counter: sales_counter ?? current.sales_counter,
        active: active ?? current.active,
        updated_at: new Date().toISOString(),
      }

      fallbackOffers[index] = updated
      return NextResponse.json(updated)
    }

    await ensureOfferSchema()
    const existing = await sql`SELECT * FROM offers WHERE id = ${id} LIMIT 1`
    if (!existing[0]) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    const current = existing[0]
    const nextDuration = duration ?? current.duration
    const nextPrice = price ?? current.price
    if (typeof nextPrice !== 'number' || Number.isNaN(nextPrice) || nextPrice <= 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 })
    }
    const nextTitle = buildOfferTitle(nextDuration)
    const result = await sql`
      UPDATE offers
      SET title = ${nextTitle}, duration = ${nextDuration}, price = ${nextPrice}, 
          old_price = ${old_price || null}, badge = ${null},
          sales_counter = ${sales_counter ?? current.sales_counter}, active = ${active ?? current.active},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Update offer error:', error)
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Offer id is required' }, { status: 400 })
    }

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { error } = await supabase.from('offers').delete().eq('id', Number(id))
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (!hasDatabase) {
      const index = fallbackOffers.findIndex((offer) => offer.id === Number(id))
      if (index === -1) {
        return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
      }
      fallbackOffers.splice(index, 1)
      return NextResponse.json({ success: true })
    }

    await ensureOfferSchema()

    await sql`
      DELETE FROM offers WHERE id = ${id}
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete offer error:', error)
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
  }
}
