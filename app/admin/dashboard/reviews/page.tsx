'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Review {
  id: number
  username: string
  text: string
  rating: number
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ username: '', text: '', rating: 5 })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews')
      const data = await response.json()
      setReviews(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/reviews', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...formData, active: true } : formData),
      })
      if (response.ok) {
        setFormData({ username: '', text: '', rating: 5 })
        setShowForm(false)
        setEditingId(null)
        fetchReviews()
      }
    } catch (error) {
      console.error('Failed to save review:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Failed to delete review:', error)
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">إدارة المراجعات</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ username: '', text: '', rating: 5 })
            }
          }}
          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
        >
          {showForm ? 'إلغاء' : 'إضافة مراجعة'}
        </Button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveReview}
          className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6 mb-8 space-y-4"
        >
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
          />
          <textarea
            placeholder="نص المراجعة"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
          />
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/30 text-white focus:border-purple-400 focus:outline-none"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} نجوم</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          >
            {editingId ? 'تحديث المراجعة' : 'إضافة المراجعة'}
          </button>
        </motion.form>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            whileHover={{ x: 5 }}
            className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white">{review.username}</h3>
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
            </div>
            <p className="text-gray-400 mb-4">{review.text}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingId(review.id)
                  setFormData({ username: review.username, text: review.text, rating: review.rating })
                  setShowForm(true)
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(review.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition text-sm"
              >
                حذف
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
