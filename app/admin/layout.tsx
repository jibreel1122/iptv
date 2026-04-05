'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false)
      return
    }
    checkAuth()
  }, [isLoginPage])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/session')
      const data = await response.json().catch(() => ({ authenticated: false }))

      if (response.ok && data?.authenticated === true) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.replace('/admin/login')
      }
    } catch (error) {
      setIsAuthenticated(false)
      router.replace('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    { label: 'لوحة التحكم', href: '/admin/dashboard' },
    { label: 'الطلبات', href: '/admin/dashboard/orders' },
    { label: 'المحتوى', href: '/admin/dashboard/content' },
    { label: 'العروض', href: '/admin/dashboard/offers' },
    { label: 'المميزات', href: '/admin/dashboard/features' },
    { label: 'المراجعات', href: '/admin/dashboard/reviews' },
    { label: 'الثيمات', href: '/admin/dashboard/themes' },
    { label: 'الإعدادات', href: '/admin/dashboard/settings' },
  ]

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 border-r border-purple-500/20 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-purple-500/20">
          <Link href="/admin/dashboard" className="flex items-center gap-3 text-xl font-bold text-white">
            <img
              src="/logo.png"
              alt="Studo Logo"
              className="w-9 h-9 rounded-lg object-cover"
              onError={(event) => {
                const el = event.currentTarget
                if (el.dataset.fallbackApplied === '1') return
                el.dataset.fallbackApplied = '1'
                el.src = '/icon-dark-32x32.png'
              }}
            />
            {sidebarOpen ? 'لوحة تحكم ستودو' : 'SA'}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-purple-500/10 text-gray-300 hover:text-white transition text-sm"
            >
              <span className="w-5 h-5 bg-purple-500/50 rounded"></span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-purple-500/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-2 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition text-sm"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-purple-500/20 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
