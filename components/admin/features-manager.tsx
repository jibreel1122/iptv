'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Feature {
  id: number
  title: string
  description: string
  active: boolean
}

export function FeaturesManager() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/admin/features')
      const data = await response.json()
      setFeatures(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch features',
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
        ? { id: editingId, ...formData }
        : formData

      const response = await fetch('/api/admin/features', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Failed to save feature')

      toast({
        title: 'Success',
        description: editingId ? 'Feature updated' : 'Feature created',
      })

      setFormData({ title: '', description: '' })
      setEditingId(null)
      setShowForm(false)
      fetchFeatures()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save feature',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return

    try {
      const response = await fetch(`/api/admin/features?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete feature')

      toast({ title: 'Success', description: 'Feature deleted' })
      fetchFeatures()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete feature',
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
          setFormData({ title: '', description: '' })
        }}
        className="bg-gradient-to-r from-purple-500 to-purple-700"
      >
        {showForm ? 'Cancel' : 'Add New Feature'}
      </Button>

      {showForm && (
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <div className="space-y-4">
            <Input
              placeholder="Feature Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-900/50 border-purple-500/30 text-white"
            />
            <textarea
              placeholder="Feature Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-slate-900/50 border border-purple-500/30 text-white rounded-md focus:border-purple-500 focus:ring-purple-500/50 focus:outline-none resize-none"
            />
            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700"
            >
              {editingId ? 'Update Feature' : 'Create Feature'}
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingId(feature.id)
                  setFormData({
                    title: feature.title,
                    description: feature.description,
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
                onClick={() => handleDelete(feature.id)}
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
