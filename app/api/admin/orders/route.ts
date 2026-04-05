import { NextResponse } from 'next/server'
import { hasDatabase, sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/admin-session'
import { fallbackOrders } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

async function checkAuth() {
  return isAdminAuthenticated()
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Admin fetch orders error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
      }

      return NextResponse.json(data ?? [])
    }

    if (!hasDatabase && !hasSupabasePublicConfig) {
      return NextResponse.json(fallbackOrders)
    }

    const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Admin fetch orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
    }

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        console.error('Admin update order error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
      }

      return NextResponse.json(data)
    }

    if (!hasDatabase && !hasSupabasePublicConfig) {
      const order = fallbackOrders.find((o) => o.id === Number(id))
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      order.status = status
      return NextResponse.json(order)
    }

    const result = await sql`
      UPDATE orders
      SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Admin update order error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get('id'))

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (!hasDatabase && hasSupabasePublicConfig) {
      const supabase = getSupabaseServerClient()
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (error) {
        console.error('Admin delete order error (Supabase):', error)
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    if (!hasDatabase && !hasSupabasePublicConfig) {
      const index = fallbackOrders.findIndex((o) => o.id === id)
      if (index >= 0) fallbackOrders.splice(index, 1)
      return NextResponse.json({ success: true })
    }

    await sql`DELETE FROM orders WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin delete order error:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
