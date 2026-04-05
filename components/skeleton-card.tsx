'use client'

export function SkeletonCard() {
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/20 rounded-xl p-6 animate-pulse">
      <div className="h-48 bg-slate-700/50 rounded-lg mb-4"></div>
      <div className="h-6 bg-slate-700/50 rounded mb-2"></div>
      <div className="h-4 bg-slate-700/50 rounded mb-4 w-3/4"></div>
      <div className="flex gap-2">
        <div className="h-10 bg-slate-700/50 rounded flex-1"></div>
        <div className="h-10 bg-slate-700/50 rounded flex-1"></div>
      </div>
    </div>
  )
}

export function SkeletonText() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-slate-700/50 rounded w-full"></div>
      <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
      <div className="h-4 bg-slate-700/50 rounded w-4/6"></div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
