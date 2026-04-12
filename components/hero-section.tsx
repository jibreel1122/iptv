'use client'

import { motion } from 'framer-motion'
import { Play, Tv, Film, Clapperboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fadeInUp, staggerContainer, hoverScale } from '@/lib/animations'

interface HeroSectionProps {
  settings: Record<string, string>
  stats: {
    channels: number
    movies: number
    series: number
  }
  onOrderClick?: () => void
}

export function HeroSection({ settings, stats, onOrderClick }: HeroSectionProps) {
  const heroTitle = settings.hero_title || 'عيش الترفيه بجودة ممتازة'
  const heroSubtitle = settings.hero_subtitle || 'شاهد آلاف القنوات والأفلام والمسلسلات بجودة 4K وبدون تقطيع'
  const ctaText = settings.hero_cta_text || 'اطلب الآن'
  const brandName = settings.brand_name || 'Studo'
  const logoSrc = settings.brand_logo || '/logo.jpg'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050019] via-transparent to-[#050019] pointer-events-none z-10" />
      
      {/* Radial glow behind logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7B2EFF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Logo */}
          <motion.div
            variants={fadeInUp}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#7B2EFF] to-[#5B1EDF] mb-4 overflow-hidden"
              animate={{ 
                boxShadow: [
                  '0 0 30px rgba(123, 46, 255, 0.5)',
                  '0 0 60px rgba(123, 46, 255, 0.8)',
                  '0 0 30px rgba(123, 46, 255, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <img
                src={logoSrc}
                alt={brandName}
                className="h-full w-full object-cover"
                onError={(event) => {
                  const el = event.currentTarget
                  if (el.dataset.fallbackApplied === '1') return
                  el.dataset.fallbackApplied = '1'
                  el.src = '/icon-dark-32x32.png'
                }}
              />
            </motion.div>
            <h2 className="text-2xl font-bold gradient-text">{brandName}</h2>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance"
          >
            <span className="text-white">{heroTitle.split(' ').slice(0, -1).join(' ')} </span>
            <span className="gradient-text text-glow">{heroTitle.split(' ').slice(-1)}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto text-pretty"
          >
            {heroSubtitle}
          </motion.p>

          {/* Stats Row */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-10"
          >
            <motion.div 
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(123, 46, 255, 0.5)' }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Tv className="w-5 h-5 text-[#7B2EFF]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stats.channels.toLocaleString()}+
              </div>
              <div className="text-sm text-white/60">قناة مباشرة</div>
            </motion.div>
            <motion.div 
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(123, 46, 255, 0.5)' }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Film className="w-5 h-5 text-[#7B2EFF]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stats.movies.toLocaleString()}+
              </div>
              <div className="text-sm text-white/60">فيلم</div>
            </motion.div>
            <motion.div 
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(123, 46, 255, 0.5)' }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clapperboard className="w-5 h-5 text-[#7B2EFF]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stats.series.toLocaleString()}+
              </div>
              <div className="text-sm text-white/60">مسلسل</div>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div {...hoverScale}>
              <Button
                size="lg"
                onClick={() => {
                  if (onOrderClick) {
                    onOrderClick()
                    return
                  }
                  window.location.href = '/order'
                }}
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-[#7B2EFF] to-[#5B1EDF] hover:from-[#8B3EFF] hover:to-[#6B2EEF] text-white rounded-full pulse-glow"
              >
                <Play className="w-5 h-5 mr-2 fill-white" />
                {ctaText}
              </Button>
            </motion.div>
            <motion.div {...hoverScale}>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold border-white/20 text-white hover:bg-white/10 rounded-full"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                اعرف أكثر
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>استقرار 99.9%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>جودة 4K Ultra HD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>دعم 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>تفعيل فوري</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-[#7B2EFF]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
