import { hasDatabase, sql } from '@/lib/db'
import { NextResponse } from 'next/server'
import { fallbackOffers, fallbackOrders } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

async function ensureOrdersSchema() {
  if (!hasDatabase) return
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)`
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS offer_title VARCHAR(255)`
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS offer_price DECIMAL(10,2)`
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'`
}

function parseErrorMessage(error: any, fallback: string) {
  const message = String(error?.message || fallback)
  if (message.toLowerCase().includes('row-level security') || error?.code === '42501') {
    return 'Supabase permission error (RLS). Please run scripts/init-db.sql in Supabase SQL Editor.'
  }
  return message
}

export async function POST(request: Request) {
  try {
    let full_name: string | null = null
    let whatsapp_number: string | null = null
    let offer_id: number | null = null
    let offer_title: string | null = null
    let offer_price: number | null = null
    let message: string | null = null

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await request.json()
      full_name = body.full_name || null
      whatsapp_number = body.whatsapp_number || null
      offer_id = body.offer_id ? Number(body.offer_id) : null
      offer_title = body.offer_title || null
      offer_price = body.offer_price ? Number(body.offer_price) : null
      message = body.message || null
    } else {
      const form = await request.formData()
      full_name = form.get('full_name') ? String(form.get('full_name')) : null
      whatsapp_number = String(form.get('whatsapp_number') || '')
      offer_id = form.get('offer_id') ? Number(form.get('offer_id')) : null
      message = form.get('message') ? String(form.get('message')) : null
    }

    full_name = full_name?.trim() || null
    whatsapp_number = whatsapp_number?.trim() || null
    message = message?.trim() || null

    if (!full_name || !whatsapp_number || !offer_id) {
      return NextResponse.json(
        { error: 'Full name, WhatsApp number, and selected offer are required' },
        { status: 400 }
      )
    }

    if (hasDatabase && (!offer_title || !offer_price)) {
      const offerRows = await sql`
        SELECT id, title, price
        FROM offers
        WHERE id = ${offer_id}
        LIMIT 1
      `
      const selectedOffer = offerRows?.[0]
      if (selectedOffer) {
        offer_title = String(selectedOffer.title)
        offer_price = Number(selectedOffer.price)
      }
    }

    if (!hasDatabase && hasSupabasePublicConfig && (!offer_title || !offer_price)) {
      const supabase = getSupabaseServerClient()
      const { data } = await supabase
        .from('offers')
        .select('id,title,price')
        .eq('id', offer_id)
        .limit(1)
        .maybeSingle()

      if (data) {
        offer_title = String(data.title)
        offer_price = Number(data.price)
      }
    }

    if (!hasDatabase && !hasSupabasePublicConfig && (!offer_title || !offer_price)) {
      const selectedOffer = fallbackOffers.find((offer) => offer.id === offer_id)
      if (selectedOffer) {
        offer_title = selectedOffer.title
        offer_price = Number(selectedOffer.price)
      }
    }

    if (!offer_title || offer_price == null || Number.isNaN(Number(offer_price))) {
      return NextResponse.json(
        { error: 'Selected offer is invalid or no longer available' },
        { status: 400 }
      )
    }

    const notes = message || null
    const legacyMessage = [
      `الاسم الكامل: ${full_name}`,
      notes ? `ملاحظات: ${notes}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const attempts = [
        {
          full_name,
          whatsapp_number,
          offer_id,
          offer_title,
          offer_price,
          message: notes,
          status: 'pending',
        },
        {
          whatsapp_number,
          offer_id,
          offer_title,
          offer_price,
          message: legacyMessage || null,
          status: 'pending',
        },
        {
          whatsapp_number,
          offer_id,
          message: legacyMessage || null,
          status: 'pending',
        },
        {
          whatsapp_number,
          offer_id,
          message: legacyMessage || null,
        },
      ]

      let data: any = null
      let error: any = null

      for (const payload of attempts) {
        const res = await supabase.from('orders').insert(payload).select('*').single()
        data = res.data
        error = res.error
        if (!error) break

        const msg = String(error?.message || '').toLowerCase()
        if (!(msg.includes('column') || msg.includes('schema cache'))) {
          break
        }
      }

      if (error) {
        console.error('Create order error (Supabase):', error)
        return NextResponse.json({ error: parseErrorMessage(error, 'Failed to create order') }, { status: 500 })
      }

      if (!contentType.includes('application/json')) {
        return NextResponse.redirect(new URL('/order?success=1', request.url), 303)
      }

      return NextResponse.json(data, { status: 201 })
    }

    if (!hasDatabase && !hasSupabasePublicConfig) {
      const newOrder = {
        id: fallbackOrders.length + 1,
        full_name,
        whatsapp_number,
        offer_id: offer_id || undefined,
        offer_title: offer_title || undefined,
        offer_price: offer_price || undefined,
        message: notes || undefined,
        status: 'pending',
        created_at: new Date().toISOString(),
      }
      fallbackOrders.unshift(newOrder)
      if (!contentType.includes('application/json')) {
        return NextResponse.redirect(new URL('/order?success=1', request.url), 303)
      }
      return NextResponse.json(newOrder, { status: 201 })
    }

    await ensureOrdersSchema()

    const result = await sql`
      INSERT INTO orders (full_name, whatsapp_number, offer_id, offer_title, offer_price, message, status)
      VALUES (${full_name}, ${whatsapp_number}, ${offer_id || null}, ${offer_title || null}, ${offer_price || null}, ${notes || null}, 'pending')
      RETURNING *
    `

    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/order?success=1', request.url), 303)
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: parseErrorMessage(error, 'Failed to create order') }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fetch orders error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
      }

      return NextResponse.json(data ?? [])
    }

    if (!hasDatabase && !hasSupabasePublicConfig) {
      return NextResponse.json(fallbackOrders)
    }
    const orders = await sql`
      SELECT * FROM orders ORDER BY created_at DESC
    `
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Fetch orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
