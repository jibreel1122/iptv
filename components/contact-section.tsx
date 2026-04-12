'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Offer {
  id: number
  title: string
  price: number
}

export function ContactSection() {
  const [fullName, setFullName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/studo_iptv')
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [offers, setOffers] = useState<Offer[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers')
        const data = await response.json()
        const safeOffers = Array.isArray(data) ? data : []
        setOffers(safeOffers)
        if (safeOffers.length > 0) {
          setSelectedOffer(safeOffers[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error)
      }
    }

    fetchOffers()

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        if (data?.social_instagram) {
          setInstagramUrl(data.social_instagram)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !whatsappNumber.trim() || !selectedOffer) {
      toast({
        title: 'خطأ',
        description: 'يرجى تعبئة جميع الحقول المطلوبة',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    setSuccessMessage('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          whatsapp_number: whatsappNumber.trim(),
          offer_id: selectedOffer,
          message: message.trim() || null,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Failed to create order')
      }

      const successText = 'مبروك! سوف نتواصل معك في أقرب وقت ممكن على الواتساب، أو يمكنك التواصل معنا مباشرة.'
      setSuccessMessage(successText)
      toast({ title: 'تم بنجاح', description: successText })

      // Reset form
      setFullName('')
      setWhatsappNumber('')
      setMessage('')
      setSelectedOffer(offers[0]?.id || null)
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'تعذر إرسال الطلب. حاول مرة أخرى.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const whatsappContact = '+970599765211'

  return (
    <section id="contact" className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-500">
              جاهز تبدأ المشاهدة؟
            </span>
          </h2>
          <p className="text-gray-300 text-lg">
            اطلب الآن خلال دقائق بخطوات سهلة
          </p>
        </div>

        {/* Order Form */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/30 p-8 md:p-12">
          {successMessage && (
            <div className="mb-5 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-emerald-100 text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-200 mb-2">
                الاسم الكامل*
              </label>
              <Input
                id="fullName"
                type="text"
                placeholder="أدخل الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-900/50 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/50"
                required
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-200 mb-2">
                رقم واتساب*
              </label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="أدخل رقم واتساب (مثال: +970599765211)"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="bg-slate-900/50 border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500/50"
                required
              />
            </div>

            {/* Select Offer */}
            <div>
              <label htmlFor="offer" className="block text-sm font-semibold text-gray-200 mb-2">
                اختر الباقة*
              </label>
              <select
                id="offer"
                value={selectedOffer || ''}
                onChange={(e) => setSelectedOffer(Number(e.target.value))}
                disabled={!offers.length}
                className="w-full px-4 py-2 bg-slate-900/50 border border-purple-500/30 text-white rounded-md focus:border-purple-500 focus:ring-purple-500/50 focus:outline-none"
                required
              >
                {!offers.length && <option value="">لا توجد باقات متاحة حالياً</option>}
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.title} - ₪{offer.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-200 mb-2">
                ملاحظات (اختياري)
              </label>
              <textarea
                id="message"
                placeholder="أي ملاحظات أو استفسارات..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-slate-900/50 border border-purple-500/30 text-white placeholder-gray-500 rounded-md focus:border-purple-500 focus:ring-purple-500/50 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white border-0 font-semibold py-3"
            >
              {loading ? 'جارٍ الإرسال...' : 'اطلب الآن'}
            </Button>
          </form>
        </Card>

        {/* Quick Contact Buttons */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <a
            href={`https://wa.me/${whatsappContact.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 13.72c.55 1.54 1.514 2.955 2.766 4.08l.412.341 1.825-.469-.6-1.86.412-.336a7.873 7.873 0 012.205-1.44c.556-.329 1.199-.545 1.861-.618 3.879-.469 7.304 2.41 7.773 6.285.469 3.875-2.41 7.304-6.285 7.773-3.875.469-7.304-2.41-7.773-6.285-.05-.407-.067-.816-.048-1.223h-.004C2.959 15.858 6.02 9.557 12.051 9.557c3.107 0 6.032 1.248 8.11 3.327 2.079 2.079 3.327 4.999 3.327 8.11 0 6.33-5.145 11.475-11.475 11.475-1.985 0-3.896-.497-5.574-1.451l-1.825.469.6 1.86-.412.336a9.87 9.87 0 005.211 1.556c5.487 0 9.95-4.463 9.95-9.95 0-2.666-1.063-5.173-2.996-7.107-1.933-1.933-4.44-2.996-7.107-2.996-5.487 0-9.95 4.463-9.95 9.95.017.407.034.816.048 1.223h.004" />
            </svg>
            تواصل عبر واتساب
          </a>
          <a
            href={instagramUrl || 'https://www.instagram.com/studo_iptv'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 9.797c.021.446.021 1.407.021 1.203 0 4.418-3.373 7.501-7.377 7.501-1.471 0-2.84-.383-4.011-1.046 1.054.125 2.07-.125 2.908-.734.997-.734 1.7-1.793 1.917-2.852-.36.089-.997.036-1.54-.412.997-.735 1.701-1.927 1.917-3.122-.36.089-1.054.125-1.701-.161 1.054-1.046 1.7-2.716 1.7-4.58-.916.472-1.917.749-3.014.749.997-.734 1.701-1.927 1.917-3.122h-2.193c-.216 1.195-.842 2.255-1.701 3.122C7.375 5.502 5.969 4.847 4.497 4.847c-1.054 0-2.025.361-2.84.997 1.054-1.046 2.493-1.7 4.078-1.7 1.472 0 2.84.383 4.01 1.046-1.053-.125-2.07.125-2.908.734-.997.734-1.7 1.793-1.917 2.852.36-.089.997-.036 1.54.412-.997.735-1.701 1.927-1.917 3.122.36-.089 1.054-.125 1.701.161C7.375 14.156 6.73 15.826 6.73 17.465c.916-.472 1.917-.749 3.014-.749-.997.734-1.701 1.927-1.917 3.122h2.193c.216-1.195.842-2.255 1.701-3.122 1.471 1.046 2.877 1.701 4.35 1.701 1.053 0 2.024-.361 2.84-.997-1.054 1.046-2.494 1.7-4.079 1.7z" />
            </svg>
            حساب إنستغرام
          </a>
        </div>

        <p className="mt-6 text-center text-green-300 font-semibold">نوفر تجربة مجانية ليوم واحد، تواصل معنا على واتساب.</p>
      </div>
    </section>
  )
}
