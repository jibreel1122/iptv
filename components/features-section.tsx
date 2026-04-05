'use client'

import { motion } from 'framer-motion'
import { 
  Tv, Monitor, Smartphone, Film, Zap, Headphones,
  Globe, Shield, Clock, Wifi, Play, Settings
} from 'lucide-react'
import { scrollReveal, staggerContainer, fadeInUp } from '@/lib/animations'
import type { Feature } from '@/lib/db'

interface FeaturesSectionProps {
  features: Feature[]
}

const iconMap: Record<string, React.ElementType> = {
  Tv,
  Monitor,
  Smartphone,
  Film,
  Zap,
  Headphones,
  Globe,
  Shield,
  Clock,
  Wifi,
  Play,
  Settings,
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7B2EFF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7B2EFF]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          {...scrollReveal}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#7B2EFF]/20 text-[#7B2EFF] text-sm font-medium mb-4">
            لماذا نحن؟
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            مميزات قوية لتجربة مشاهدة أفضل
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            استمتع ببث سريع ومستقر مع مزايا مصممة لراحتك
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = iconMap[feature.icon || 'Tv'] || Tv
            
            return (
              <motion.div
                key={feature.id}
                variants={fadeInUp}
                className="group relative p-6 rounded-2xl bg-[#0B0033]/60 border border-white/10 backdrop-blur-sm overflow-hidden"
                whileHover={{ 
                  borderColor: 'rgba(123, 46, 255, 0.5)',
                  y: -4
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B2EFF]/0 to-[#7B2EFF]/0 group-hover:from-[#7B2EFF]/10 group-hover:to-transparent transition-all duration-500" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-[#7B2EFF]/20 flex items-center justify-center mb-4 group-hover:bg-[#7B2EFF]/30 transition-colors">
                    <Icon className="w-7 h-7 text-[#7B2EFF]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional info cards */}
        <motion.div
          {...scrollReveal}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7B2EFF]/20 to-transparent border border-[#7B2EFF]/30">
            <div className="text-4xl font-bold text-white mb-2">100+</div>
            <div className="text-white/60">دول مدعومة</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7B2EFF]/20 to-transparent border border-[#7B2EFF]/30">
            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
            <div className="text-white/60">استقرار الخوادم</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7B2EFF]/20 to-transparent border border-[#7B2EFF]/30">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-white/60">دعم العملاء</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
