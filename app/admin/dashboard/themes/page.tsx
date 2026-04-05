'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Theme {
  id: number
  name: string
  description: string
  particle_type: string
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchThemes()
  }, [])

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes')
      const data = await response.json()
      setThemes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch themes:', error)
    } finally {
      setLoading(false)
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
      <h1 className="text-3xl font-bold text-white mb-8">الثيمات والخلفيات</h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {themes.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ y: -10 }}
            className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6 cursor-pointer group"
          >
            <div className="w-full h-32 bg-gradient-to-br from-purple-600/30 to-slate-600/30 rounded-lg mb-4 flex items-center justify-center group-hover:from-purple-600/50 group-hover:to-slate-600/50 transition">
              <span className="text-3xl">{theme.particle_type === 'sports' ? '⚽' : theme.particle_type === 'cinema' ? '🎬' : theme.particle_type === 'celebration' ? '🎉' : '✨'}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 capitalize">{theme.name}</h3>
            <p className="text-gray-400 text-sm">{theme.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {themes.length === 0 && (
        <p className="text-gray-400 mt-6">لا توجد ثيمات مفعلة حالياً.</p>
      )}
    </div>
  )
}
