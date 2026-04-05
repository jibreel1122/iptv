'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="border-t border-purple-500/20 bg-gradient-to-b from-slate-900/50 to-black py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Studo IPTV</h3>
            <p className="text-gray-400 text-sm">منصة بث ترفيهية توفر قنوات وأفلام ومسلسلات بجودة عالية.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#offers" className="hover:text-purple-400 transition">العروض</Link></li>
              <li><Link href="#features" className="hover:text-purple-400 transition">المميزات</Link></li>
              <li><Link href="/about" className="hover:text-purple-400 transition">ما هو هذا الموقع؟</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#contact" className="hover:text-purple-400 transition">تواصل معنا</Link></li>
              <li><Link href="/admin" className="hover:text-purple-400 transition">لوحة التحكم</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">معلومات</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>تجربة مجانية ليوم واحد عبر واتساب</p>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Studo IPTV. جميع الحقوق محفوظة. هذا الموقع تم إنشاؤه بواسطة jibreel bornat.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm text-gray-500">
              <Link href="#" className="hover:text-purple-400 transition">الخصوصية</Link>
              <Link href="#" className="hover:text-purple-400 transition">الشروط</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
