'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Review {
  id: number
  username: string
  rating: number
  text: string
  active: boolean
}

export function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    rating: '5',
    text: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews')
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId
        ? { id: editingId, ...formData, rating: parseInt(formData.rating) }
        : { ...formData, rating: parseInt(formData.rating) }

      const response = await fetch('/api/admin/reviews', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Failed to save review')

      toast({
        title: 'Success',
        description: editingId ? 'Review updated' : 'Review created',
      })

      setFormData({ username: '', rating: '5', text: '' })
      setEditingId(null)
      setShowForm(false)
      fetchReviews()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save review',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return

    try {
      const response = await fetch(`/api/admin/reviews?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete review')

      toast({ title: 'Success', description: 'Review deleted' })
      fetchReviews()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      })
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
          setFormData({ username: '', rating: '5', text: '' })
        }}
        className="bg-gradient-to-r from-purple-500 to-purple-700"
      >
        {showForm ? 'Cancel' : 'Add New Review'}
      </Button>

      {showForm && (
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <div className="space-y-4">
            <Input
              placeholder="Username (e.g., user1234)"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="bg-slate-900/50 border-purple-500/30 text-white"
            />
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900/50 border border-purple-500/30 text-white rounded-md"
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <textarea
              placeholder="Review Text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-slate-900/50 border border-purple-500/30 text-white rounded-md focus:border-purple-500 focus:ring-purple-500/50 focus:outline-none resize-none"
            />
            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700"
            >
              {editingId ? 'Update Review' : 'Create Review'}
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold">{review.username}</p>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{review.text}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingId(review.id)
                  setFormData({
                    username: review.username,
                    rating: review.rating.toString(),
                    text: review.text,
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
                onClick={() => handleDelete(review.id)}
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
