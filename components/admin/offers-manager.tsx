'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Offer {
  id: number
  title: string
  duration: string
  price: number
  old_price?: number
  badge?: string
  sales_counter: number
  active: boolean
}

export function OffersManager() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('')
  const [formData, setFormData] = useState({
    duration: '',
    price: '',
    old_price: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/admin/offers')
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch offers')
      }
      setOffers(Array.isArray(data) ? data : [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch offers',
        variant: 'destructive',
      })
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setStatusMessage('')
      setStatusType('')

      if (!formData.duration.trim()) {
        const msg = 'Duration is required'
        toast({ title: 'Error', description: msg, variant: 'destructive' })
        setStatusMessage(msg)
        setStatusType('error')
        return
      }

      const parsedPrice = parseFloat(formData.price)
      const parsedOldPrice = formData.old_price ? parseFloat(formData.old_price) : null
      if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
        const msg = 'Please enter a valid price'
        toast({ title: 'Error', description: msg, variant: 'destructive' })
        setStatusMessage(msg)
        setStatusType('error')
        return
      }

      const url = editingId ? '/api/admin/offers' : '/api/admin/offers'
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId
        ? {
            id: editingId,
            ...formData,
            price: parsedPrice,
            old_price: parsedOldPrice,
          }
        : {
            ...formData,
            price: parsedPrice,
            old_price: parsedOldPrice,
          }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        throw new Error(errorPayload?.error || 'Failed to save offer')
      }

      toast({
        title: 'Success',
        description: editingId ? 'Offer updated' : 'Offer created',
      })
      setStatusMessage(editingId ? 'Offer updated successfully' : 'Offer created successfully')
      setStatusType('success')

      setFormData({ duration: '', price: '', old_price: '' })
      setEditingId(null)
      setShowForm(false)
      fetchOffers()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save offer',
        variant: 'destructive',
      })
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save offer')
      setStatusType('error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return

    try {
      const response = await fetch(`/api/admin/offers?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        throw new Error(errorPayload?.error || 'Failed to delete offer')
      }

      toast({ title: 'Success', description: 'Offer deleted' })
      setStatusMessage('Offer deleted successfully')
      setStatusType('success')
      fetchOffers()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete offer',
        variant: 'destructive',
      })
      setStatusMessage(error instanceof Error ? error.message : 'Failed to delete offer')
      setStatusType('error')
    }
  }

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-700 rounded-lg" />
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={() => {
          setShowForm(!showForm)
          setEditingId(null)
          setFormData({ duration: '', price: '', old_price: '' })
          setStatusMessage('')
          setStatusType('')
        }}
        className="bg-gradient-to-r from-purple-500 to-purple-700"
      >
        {showForm ? 'Cancel' : 'Add New Offer'}
      </Button>

      {statusMessage && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            statusType === 'error'
              ? 'border-red-500/40 bg-red-500/10 text-red-200'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {statusMessage}
        </div>
      )}

      {showForm && (
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <div className="space-y-4">
            <Input
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="bg-slate-900/50 border-purple-500/30 text-white"
            />
            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="bg-slate-900/50 border-purple-500/30 text-white"
            />
            <Input
              type="number"
              placeholder="Old Price (optional)"
              value={formData.old_price}
              onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
              className="bg-slate-900/50 border-purple-500/30 text-white"
            />
            <p className="text-xs text-gray-400">
              سيتم إنشاء عنوان العرض تلقائياً بناءً على المدة، والمميزات تظهر تلقائياً في الواجهة.
            </p>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700"
            >
              {saving ? 'Saving...' : editingId ? 'Update Offer' : 'Create Offer'}
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-4"
          >
            <h4 className="font-bold text-lg mb-2">{offer.title}</h4>
            <p className="text-gray-300 text-sm mb-4">{offer.duration}</p>
            <p className="text-2xl font-bold text-purple-400 mb-4">₪{offer.price}</p>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingId(offer.id)
                  setFormData({
                    duration: offer.duration,
                    price: offer.price.toString(),
                    old_price: offer.old_price?.toString() || '',
                  })
                  setShowForm(true)
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(offer.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
