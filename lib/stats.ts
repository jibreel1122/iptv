import type { Stats } from '@/lib/db'

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function getAutoGrowingStats(base: Stats | null) {
  const fallback = { channels: 8000, movies: 19000, series: 8500 }
  if (!base) {
    return fallback
  }

  const sourceDate = base.updated_at ? new Date(base.updated_at) : new Date()
  const now = new Date()

  const sourceDay = new Date(sourceDate.getFullYear(), sourceDate.getMonth(), sourceDate.getDate())
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const daysElapsed = Math.max(0, Math.floor((today.getTime() - sourceDay.getTime()) / 86400000))
  if (daysElapsed === 0) {
    return {
      channels: Number(base.channels),
      movies: Number(base.movies),
      series: Number(base.series),
    }
  }

  let channelsInc = 0
  let moviesInc = 0
  let seriesInc = 0

  for (let day = 1; day <= daysElapsed; day += 1) {
    let remaining = 40
    const seedBase = sourceDay.getTime() / 86400000 + day

    const c = Math.floor(seededRandom(seedBase + 11) * (remaining + 1))
    remaining -= c

    const m = Math.floor(seededRandom(seedBase + 29) * (remaining + 1))
    remaining -= m

    const s = remaining

    channelsInc += c
    moviesInc += m
    seriesInc += s
  }

  return {
    channels: Number(base.channels) + channelsInc,
    movies: Number(base.movies) + moviesInc,
    series: Number(base.series) + seriesInc,
  }
}
