'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Setting {
  id: number
  key: string
  value: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value: editValue }),
      })
      if (response.ok) {
        setEditingId(null)
        fetchSettings()
      }
    } catch (error) {
      console.error('Failed to save setting:', error)
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
      <h1 className="text-3xl font-bold text-white mb-8">إعدادات المنصة</h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {settings.map((setting) => (
          <motion.div
            key={setting.id}
            whileHover={{ x: 5 }}
            className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-300 mb-2 capitalize">
                  {setting.key.replace(/_/g, ' ')}
                </label>
                {editingId === setting.id ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/30 text-white focus:border-purple-400 focus:outline-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-400">{setting.value}</p>
                )}
              </div>
              {editingId === setting.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(setting.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition text-sm"
                  >
                    حفظ
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(setting.id)
                    setEditValue(setting.value)
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm"
                >
                  تعديل
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
