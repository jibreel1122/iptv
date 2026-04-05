'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Sparkles, Crown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { scrollReveal, staggerContainer, fadeInUp } from '@/lib/animations'
import type { Offer } from '@/lib/db'

interface OffersSectionProps {
  offers: Offer[]
  onSelectOffer?: (offer: Offer) => void
}

const badgeIcons: Record<string, React.ElementType> = {
  'الأكثر طلباً': Sparkles,
  'أفضل سعر': Crown,
  'عرض قوي': Zap,
  'الأوفر': Zap,
}

const sharedPlanFeatures = [
  'كل القنوات المباشرة',
  'مكتبة أفلام ومسلسلات كبيرة',
  'جودة HD و 4K',
  'تحديثات يومية للمحتوى',
  'دعم فني سريع 24/7',
  'تفعيل سريع بعد الطلب',
  'مناسب لمختلف الأجهزة',
  'تجربة مجانية ليوم واحد عبر واتساب',
]

export function OffersSection({ offers, onSelectOffer }: OffersSectionProps) {
  return (
    <section id="offers" className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7B2EFF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          {...scrollReveal}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#7B2EFF]/20 text-[#7B2EFF] text-sm font-medium mb-4">الباقات</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            اختر الباقة المناسبة لك
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            كل الباقات تشمل تفعيل فوري ووصول كامل للمحتوى
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {offers.map((offer) => {
            const BadgeIcon = offer.badge ? badgeIcons[offer.badge] || Sparkles : null
            const isPopular = offer.badge === 'الأكثر طلباً'
            
            return (
              <motion.div
                key={offer.id}
                variants={fadeInUp}
                className={`relative rounded-2xl p-6 h-full min-h-[520px] flex flex-col ${
                  isPopular 
                    ? 'bg-gradient-to-b from-[#7B2EFF]/30 to-[#0B0033] border-2 border-[#7B2EFF]' 
                    : 'bg-[#0B0033]/80 border border-white/10'
                } backdrop-blur-sm`}
                whileHover={{ 
                  y: -8, 
                  boxShadow: isPopular 
                    ? '0 20px 60px rgba(123, 46, 255, 0.4)' 
                    : '0 20px 40px rgba(123, 46, 255, 0.2)'
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Badge */}
                {offer.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                    isPopular 
                      ? 'bg-[#7B2EFF] text-white' 
                      : 'bg-white/10 text-white/80'
                  }`}>
                    {BadgeIcon && <BadgeIcon className="w-4 h-4" />}
                    {offer.badge}
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-xl font-bold text-white mt-4 mb-2">{offer.title}</h3>
                <p className="text-white/60 text-sm mb-4">{offer.duration}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">₪{Number(offer.price).toFixed(2)}</span>
                    {offer.old_price && (
                      <span className="text-lg text-white/40 line-through">₪{Number(offer.old_price).toFixed(2)}</span>
                    )}
                  </div>
                  {offer.old_price && (
                    <span className="text-sm text-green-400">
                      وفّر ₪{(Number(offer.old_price) - Number(offer.price)).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                  {sharedPlanFeatures.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                      <Check className="w-4 h-4 text-[#7B2EFF] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button asChild
                  className={`w-full py-6 rounded-xl font-semibold ${
                    isPopular
                      ? 'bg-[#7B2EFF] hover:bg-[#6B1EEF] text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Link href={`/order?offer=${offer.id}`}>اطلب الآن</Link>
                </Button>

                {/* Sales counter */}
                {offer.sales_counter > 0 && (
                  <p className="text-center text-white/40 text-xs mt-4">
                    {offer.sales_counter} طلب اليوم
                  </p>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Money back guarantee */}
        <motion.div
          {...scrollReveal}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-white/80">تجربة مجانية ليوم واحد عبر واتساب</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
