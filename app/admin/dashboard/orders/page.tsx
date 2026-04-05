'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Order {
  id: number
  full_name?: string
  whatsapp_number: string
  offer_id?: number
  offer_title?: string
  offer_price?: number
  message?: string
  status: string
  created_at: string
}

interface Offer {
  id: number
  title: string
  price: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [offersById, setOffersById] = useState<Record<number, Offer>>({})
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setErrorMessage('')
      const [response, offersResponse] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/offers'),
      ])

      const data = await response.json().catch(() => null)
      const offersData = await offersResponse.json().catch(() => null)

      if (Array.isArray(offersData)) {
        const map: Record<number, Offer> = {}
        for (const offer of offersData) {
          if (offer && typeof offer.id === 'number') {
            map[offer.id] = {
              id: offer.id,
              title: String(offer.title || ''),
              price: Number(offer.price || 0),
            }
          }
        }
        setOffersById(map)
      }

      if (!response.ok) {
        const fallbackResponse = await fetch('/api/orders')
        const fallbackData = await fallbackResponse.json().catch(() => null)
        if (fallbackResponse.ok && Array.isArray(fallbackData)) {
          setOrders(fallbackData)
          setErrorMessage('تم عرض الطلبات عبر مسار بديل بسبب مشكلة في مسار الإدارة.')
          return
        }

        throw new Error(data?.error || 'Failed to fetch orders')
      }

      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
      setErrorMessage(error instanceof Error ? error.message : 'تعذر جلب الطلبات')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id)
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (response.ok) {
        fetchOrders()
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteOrder = async (id: number) => {
    const ok = window.confirm('هل تريد حذف الطلب؟')
    if (!ok) return
    const response = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      fetchOrders()
    }
  }

  const extractLegacyName = (message?: string) => {
    if (!message) return ''
    const line = message
      .split('\n')
      .find((l) => l.trim().startsWith('الاسم الكامل:'))
    return line ? line.replace('الاسم الكامل:', '').trim() : ''
  }

  const extractLegacyNotes = (message?: string) => {
    if (!message) return ''
    const line = message
      .split('\n')
      .find((l) => l.trim().startsWith('ملاحظات:'))
    if (line) return line.replace('ملاحظات:', '').trim()
    if (message.includes('الاسم الكامل:')) return ''
    return message
  }

  const getOrderOffer = (order: Order) => {
    const fallback = order.offer_id ? offersById[order.offer_id] : undefined
    return {
      title: order.offer_title || fallback?.title || '-',
      price: Number(order.offer_price ?? fallback?.price ?? 0),
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">إدارة الطلبات</h1>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {errorMessage}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-900/30 border-b border-purple-500/20">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">الاسم الكامل</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">رقم واتساب</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">الباقة</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">السعر</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">الملاحظات</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">الحالة</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">التاريخ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/10">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-400">
                    لا توجد طلبات بعد
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-purple-900/10 transition"
                  >
                    {(() => {
                      const offer = getOrderOffer(order)
                      return (
                        <>
                    <td className="px-6 py-4 text-sm text-gray-300">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-200 font-medium">{order.full_name || extractLegacyName(order.message) || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{order.whatsapp_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{offer.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">₪{offer.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 max-w-[240px] truncate">{extractLegacyNotes(order.message) || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="rounded-md border border-white/20 bg-slate-900 px-2 py-1 text-xs text-white"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="active">نشط</option>
                        <option value="done">مكتمل</option>
                        <option value="canceled">ملغي</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        حذف
                      </button>
                    </td>
                        </>
                      )
                    })()}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
