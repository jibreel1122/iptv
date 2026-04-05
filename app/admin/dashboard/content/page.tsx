'use client'

import { useEffect, useState } from 'react'

interface Category {
  id: number
  name: string
}

interface ContentItem {
  id: number
  title: string
  category_id: number
  category_name?: string
  description?: string
  poster_url?: string
  thumbnail_url?: string
  year?: string
  rating?: string
  active: boolean
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    category_id: 0,
    title: '',
    description: '',
    poster_url: '',
    thumbnail_url: '',
    year: '',
    rating: '',
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content')
      const data = await response.json()
      setItems(Array.isArray(data.items) ? data.items : [])
      setCategories(Array.isArray(data.categories) ? data.categories : [])

      if (Array.isArray(data.categories) && data.categories.length && formData.category_id === 0) {
        setFormData((prev) => ({ ...prev, category_id: data.categories[0].id }))
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      category_id: categories[0]?.id || 0,
      title: '',
      description: '',
      poster_url: '',
      thumbnail_url: '',
      year: '',
      rating: '',
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const body = editingId ? { id: editingId, ...formData, active: true } : formData

    const response = await fetch('/api/admin/content', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      resetForm()
      fetchContent()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    const response = await fetch(`/api/admin/content?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      fetchContent()
    }
  }

  if (loading) {
    return <div className="text-white">جارٍ التحميل...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">إدارة المحتوى والصور</h1>

      {!categories.length && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
          لا توجد تصنيفات محتوى. الرجاء إضافة التصنيفات أولاً قبل إضافة عناصر جديدة.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-purple-500/30 bg-slate-900/40 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
            disabled={!categories.length}
            className="rounded-lg border border-purple-500/30 bg-slate-900/60 p-3 text-white"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="عنوان المحتوى"
            className="rounded-lg border border-purple-500/30 bg-slate-900/60 p-3 text-white"
          />

          <input
            value={formData.poster_url}
            onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
            placeholder="رابط الصورة الرئيسية"
            className="rounded-lg border border-purple-500/30 bg-slate-900/60 p-3 text-white"
          />

          <input
            value={formData.thumbnail_url}
            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
            placeholder="رابط الصورة المصغرة"
            className="rounded-lg border border-purple-500/30 bg-slate-900/60 p-3 text-white"
          />

          <input
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="السنة"
            className="rounded-lg border border-purple-500/30 bg-slate-900/60 p-3 text-white"
          />

          <input
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            placeholder="التقييم"
            className="rounded-lg border border-purple-500/30 bg-slate-900/60 p-3 text-white"
          />
        </div>

        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="وصف مختصر"
          className="w-full rounded-lg border border-purple-500/30 bg-slate-900/60 p-3 text-white min-h-24"
        />

        <div className="flex gap-3">
          <button type="submit" disabled={!categories.length} className="rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60">
            {editingId ? 'تحديث المحتوى' : 'إضافة محتوى'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/20 px-5 py-2 text-white">
              إلغاء التعديل
            </button>
          )}
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-purple-500/30 bg-slate-900/40 p-4 text-white">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-sm text-white/60">{item.category_name}</p>
            <p className="text-sm text-white/70 mt-2">{item.description}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-white/60 mb-1">الصورة الرئيسية</p>
                <div className="h-20 w-full overflow-hidden rounded border border-white/15 bg-black/30">
                  {item.poster_url ? (
                    <img src={item.poster_url} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-white/40">لا توجد صورة</div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">الصورة المصغرة</p>
                <div className="h-20 w-full overflow-hidden rounded border border-white/15 bg-black/30">
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-white/40">لا توجد صورة</div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-white/60 space-y-1">
              <p>الصورة: {item.poster_url || '-'}</p>
              <p>المصغرة: {item.thumbnail_url || '-'}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setEditingId(item.id)
                  setFormData({
                    category_id: item.category_id,
                    title: item.title || '',
                    description: item.description || '',
                    poster_url: item.poster_url || '',
                    thumbnail_url: item.thumbnail_url || '',
                    year: item.year || '',
                    rating: item.rating || '',
                  })
                }}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-sm"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
