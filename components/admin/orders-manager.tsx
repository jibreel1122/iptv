'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Order {
  id: number
  full_name?: string
  whatsapp_number: string
  offer_id: number
  offer_title?: string
  offer_price?: number
  message?: string
  created_at: string
}

interface Offer {
  id: number
  title: string
  price: number
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [offers, setOffers] = useState<Record<number, Offer>>({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ordersRes, offersRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/offers'),
      ])

      const ordersData = await ordersRes.json()
      const offersData = await offersRes.json()

      setOrders(ordersData)

      const offersMap: Record<number, Offer> = {}
      offersData.forEach((offer: Offer) => {
        offersMap[offer.id] = offer
      })
      setOffers(offersMap)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getOfferInfo = (offerId: number) => {
    return offers[offerId] || { title: 'Unknown', price: 0 }
  }

  const getOrderOffer = (order: Order) => {
    const fromMap = getOfferInfo(order.offer_id)
    return {
      title: order.offer_title || fromMap.title,
      price: Number(order.offer_price ?? fromMap.price ?? 0),
    }
  }

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-700 rounded-lg" />
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <h3 className="text-sm text-gray-400 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-purple-400">{orders.length}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <h3 className="text-sm text-gray-400 mb-2">Today</h3>
          <p className="text-3xl font-bold text-purple-400">
            {orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length}
          </p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <h3 className="text-sm text-gray-400 mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-400">
            ₪{orders.reduce((sum, order) => sum + getOrderOffer(order).price, 0)}
          </p>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-purple-900/20 to-slate-900/20 border border-purple-500/30">
            <tr>
              <th className="px-6 py-3 text-left text-gray-300">ID</th>
              <th className="px-6 py-3 text-left text-gray-300">Name</th>
              <th className="px-6 py-3 text-left text-gray-300">WhatsApp</th>
              <th className="px-6 py-3 text-left text-gray-300">Plan</th>
              <th className="px-6 py-3 text-left text-gray-300">Price</th>
              <th className="px-6 py-3 text-left text-gray-300">Date</th>
              <th className="px-6 py-3 text-left text-gray-300">Message</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const offer = getOrderOffer(order)
              return (
                <tr
                  key={order.id}
                  className="border-b border-purple-500/10 hover:bg-purple-900/10 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-300">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-300">{order.full_name || '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{order.whatsapp_number}</td>
                  <td className="px-6 py-4 text-purple-400 font-semibold">{offer.title}</td>
                  <td className="px-6 py-4 text-green-400">₪{offer.price}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">
                    {order.message || '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No orders yet</p>
        </div>
      )}
    </div>
  )
}
