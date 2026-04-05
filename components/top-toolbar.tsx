'use client'

import Link from 'next/link'

const links = [
  { label: 'الرئيسية', href: '/' },
  { label: 'الأسعار', href: '#offers' },
  { label: 'المحتوى', href: '#content' },
  { label: 'المميزات', href: '#features' },
  { label: 'طريقة الاستخدام', href: '#how-to-use' },
  { label: 'تواصل معنا', href: '#contact' },
  { label: 'عن المنصة', href: '/about' },
]

export function TopToolbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-[60] border-b border-white/10 bg-[#050019]/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <nav className="flex items-center justify-between gap-3 py-3 overflow-x-auto whitespace-nowrap">
          <span className="text-sm sm:text-base font-bold text-white">ستودو IPTV</span>
          <div className="flex items-center gap-2 sm:gap-3">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs sm:text-sm text-white/90 hover:bg-white/10 hover:text-white transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
