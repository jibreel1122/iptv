'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Stats {
  id: number
  channels: number
  movies: number
  series: number
}

export function StatsManager() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [channels, setChannels] = useState('')
  const [movies, setMovies] = useState('')
  const [series, setSeries] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
      setChannels(data.channels)
      setMovies(data.movies)
      setSeries(data.series)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch stats',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channels: parseInt(channels),
          movies: parseInt(movies),
          series: parseInt(series),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update stats')
      }

      toast({
        title: 'Success',
        description: 'Stats updated successfully',
      })

      fetchStats()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stats',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-700 rounded-lg" />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <h3 className="text-sm text-gray-400 mb-2">Live Channels</h3>
          <p className="text-3xl font-bold text-purple-400">{channels}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <h3 className="text-sm text-gray-400 mb-2">Movies</h3>
          <p className="text-3xl font-bold text-purple-400">{movies}</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
          <h3 className="text-sm text-gray-400 mb-2">Series</h3>
          <p className="text-3xl font-bold text-purple-400">{series}</p>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-6">
        <h3 className="text-lg font-bold mb-4">Edit Stats</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Live Channels
            </label>
            <Input
              type="number"
              value={channels}
              onChange={(e) => setChannels(e.target.value)}
              className="bg-slate-900/50 border-purple-500/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Movies
            </label>
            <Input
              type="number"
              value={movies}
              onChange={(e) => setMovies(e.target.value)}
              className="bg-slate-900/50 border-purple-500/30 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Series
            </label>
            <Input
              type="number"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="bg-slate-900/50 border-purple-500/30 text-white"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
