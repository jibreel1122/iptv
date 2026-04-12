'use client'

import { useEffect, useState } from 'react'

export function TrialPopup() {
  const [open, setOpen] = useState(false)
  const [whatsapp, setWhatsapp] = useState('+970599765211')
  const [instagram, setInstagram] = useState('https://www.instagram.com/studo_iptv')

  useEffect(() => {
    const key = 'studo_trial_popup_seen'
    if (sessionStorage.getItem(key)) return

    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem(key, '1')
    }, 20000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data?.whatsapp_number) setWhatsapp(data.whatsapp_number)
        if (data?.social_instagram) setInstagram(data.social_instagram)
      } catch {
        // Keep fallback links
      }
    }
    loadSettings()
  }, [])

  if (!open) return null

  const whatsappDigits = whatsapp.replace(/[^\d]/g, '')

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-green-500/40 bg-[#0B0033] p-6 text-white shadow-2xl">
        <button
          onClick={() => setOpen(false)}
          className="float-left rounded-full border border-white/20 w-8 h-8 text-sm hover:bg-white/10"
          aria-label="close"
        >
          X
        </button>

        <h3 className="text-2xl font-bold mb-2">تجربة مجانية ليوم واحد</h3>
        <p className="text-white/75 mb-6">
          يسعدنا أن نقدم لك تجربة مجانية ليوم كامل. تواصل معنا الآن واختر الطريقة المناسبة لك.
        </p>

        <div className="space-y-3">
          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg bg-green-600 hover:bg-green-700 text-center py-3 font-semibold"
          >
            تواصل عبر واتساب
          </a>
          <a
            href={instagram || 'https://www.instagram.com/studo_iptv'}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-center py-3 font-semibold"
          >
            تواصل عبر إنستغرام
          </a>
        </div>
      </div>
    </div>
  )
}
