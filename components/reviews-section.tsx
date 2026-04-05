'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { scrollReveal } from '@/lib/animations'
import type { Review } from '@/lib/db'
import { Button } from '@/components/ui/button'

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  // Auto-rotate reviews
  useEffect(() => {
    if (!autoPlay || reviews.length <= 1) return
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, reviews.length])

  const navigate = (direction: 'prev' | 'next') => {
    setAutoPlay(false)
    if (direction === 'prev') {
      setActiveIndex(prev => (prev - 1 + reviews.length) % reviews.length)
    } else {
      setActiveIndex(prev => (prev + 1) % reviews.length)
    }
  }

  if (!reviews.length) return null

  return (
    <section id="reviews" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050019] via-[#0B0033]/50 to-[#050019] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          {...scrollReveal}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#7B2EFF]/20 text-[#7B2EFF] text-sm font-medium mb-4">
            آراء العملاء
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            انضم إلى آلاف العملاء السعداء بالخدمة
          </p>
        </motion.div>

        {/* Main Review Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 w-12 h-12 rounded-full bg-[#0B0033]/90 border border-white/10 text-white hover:bg-[#7B2EFF] hover:border-[#7B2EFF] hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 w-12 h-12 rounded-full bg-[#0B0033]/90 border border-white/10 text-white hover:bg-[#7B2EFF] hover:border-[#7B2EFF] hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Review Card */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {reviews[activeIndex] && (
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  {/* Quote icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#7B2EFF]/20 flex items-center justify-center">
                      <Quote className="w-8 h-8 text-[#7B2EFF]" />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < reviews[activeIndex].rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
                    &quot;{reviews[activeIndex].text}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B2EFF] to-[#5B1EDF] flex items-center justify-center mb-3">
                      <span className="text-2xl font-bold text-white">
                        {reviews[activeIndex].username.charAt(0)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white text-lg">
                      {reviews[activeIndex].username}
                    </h4>
                    {reviews[activeIndex].country && (
                      <div className="flex items-center gap-1 text-white/50 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        {reviews[activeIndex].country}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoPlay(false)
                  setActiveIndex(index)
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-[#7B2EFF] w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review summary stats */}
        <motion.div
          {...scrollReveal}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white">4.9</div>
            <div className="flex justify-center gap-1 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="text-white/50 text-sm">متوسط التقييم</div>
          </div>
          <div className="w-px bg-white/10 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">10,000+</div>
            <div className="text-white/50 text-sm mt-2">عملاء سعداء</div>
          </div>
          <div className="w-px bg-white/10 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-white/50 text-sm mt-2">دولة</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
