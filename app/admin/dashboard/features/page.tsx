'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Feature {
  id: number
  title: string
  description: string
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '' })

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/admin/features')
      const data = await response.json()
      setFeatures(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch features:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/features', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...formData, active: true } : formData),
      })
      if (response.ok) {
        setFormData({ title: '', description: '' })
        setShowForm(false)
        setEditingId(null)
        fetchFeatures()
      }
    } catch (error) {
      console.error('Failed to save feature:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/features?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchFeatures()
      }
    } catch (error) {
      console.error('Failed to delete feature:', error)
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
        <h1 className="text-3xl font-bold text-white">إدارة المميزات</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({ title: '', description: '' })
            }
          }}
          className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
        >
          {showForm ? 'إلغاء' : 'إضافة ميزة'}
        </Button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveFeature}
          className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6 mb-8 space-y-4"
        >
          <input
            type="text"
            placeholder="عنوان الميزة"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
          />
          <textarea
            placeholder="وصف الميزة"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          >
            {editingId ? 'تحديث الميزة' : 'إضافة الميزة'}
          </button>
        </motion.form>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            whileHover={{ x: 5 }}
            className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6 flex justify-between items-start"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
            <button
              onClick={() => {
                setEditingId(feature.id)
                setFormData({ title: feature.title, description: feature.description })
                setShowForm(true)
              }}
              className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm"
            >
              تعديل
            </button>
            <button
              onClick={() => handleDelete(feature.id)}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition text-sm"
            >
              حذف
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
