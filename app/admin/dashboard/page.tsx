'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Stats {
  channels: number
  movies: number
  series: number
}

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeSubscriptions: number
  stats: Stats
}

export default function AdminDashboard() {
  const [dashStats, setDashStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
      ])

      const stats = await statsRes.json()
      const orders = await ordersRes.json()

      const totalRevenue = Array.isArray(orders)
        ? orders.reduce((sum, order) => sum + (order.offer_price || 0), 0)
        : 0

      setDashStats({
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalRevenue,
        activeSubscriptions: Array.isArray(orders) ? orders.filter((o: any) => o.status === 'active').length : 0,
        stats: stats || { channels: 0, movies: 0, series: 0 },
      })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
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
      <h1 className="text-3xl font-bold text-white mb-8">لوحة التحكم</h1>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Total Orders */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition"
        >
          <p className="text-gray-400 text-sm mb-2">إجمالي الطلبات</p>
          <p className="text-3xl font-bold text-white">{dashStats?.totalOrders || 0}</p>
          <p className="text-xs text-gray-500 mt-2">منذ البداية</p>
        </motion.div>

        {/* Total Revenue */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition"
        >
          <p className="text-gray-400 text-sm mb-2">إجمالي الإيرادات</p>
          <p className="text-3xl font-bold text-white">₪{dashStats?.totalRevenue.toFixed(2) || '0.00'}</p>
          <p className="text-xs text-gray-500 mt-2">بالشيكل</p>
        </motion.div>

        {/* Active Subscriptions */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition"
        >
          <p className="text-gray-400 text-sm mb-2">الاشتراكات النشطة</p>
          <p className="text-3xl font-bold text-white">{dashStats?.activeSubscriptions || 0}</p>
          <p className="text-xs text-gray-500 mt-2">حالياً</p>
        </motion.div>

        {/* Total Content */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition"
        >
          <p className="text-gray-400 text-sm mb-2">إجمالي المحتوى</p>
          <p className="text-3xl font-bold text-white">
            {((dashStats?.stats.channels || 0) + (dashStats?.stats.movies || 0) + (dashStats?.stats.series || 0))}
          </p>
          <p className="text-xs text-gray-500 mt-2">كل العناصر</p>
        </motion.div>
      </motion.div>

      {/* Content Breakdown */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">تفصيل المحتوى</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">القنوات المباشرة</p>
            <p className="text-2xl font-bold text-purple-400">{dashStats?.stats.channels || 0}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">الأفلام</p>
            <p className="text-2xl font-bold text-purple-400">{dashStats?.stats.movies || 0}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">المسلسلات</p>
            <p className="text-2xl font-bold text-purple-400">{dashStats?.stats.series || 0}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
