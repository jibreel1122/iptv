'use client'

import { useState, useEffect, FormEvent } from 'react'
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
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const happyCustomersStart = 10
  const happyCustomersDailyGrowth = 3
  const happyCustomersStartDate = new Date('2026-04-05T00:00:00Z')
  const daysElapsed = Math.max(
    0,
    Math.floor((Date.now() - happyCustomersStartDate.getTime()) / 86400000)
  )
  const happyCustomers = happyCustomersStart + daysElapsed * happyCustomersDailyGrowth

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

  const submitReview = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitMessage('')
    setSubmitError('')

    if (!reviewName.trim() || !reviewText.trim() || reviewRating < 1 || reviewRating > 5) {
      setSubmitError('يرجى إدخال الاسم والتقييم والمراجعة بشكل صحيح.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: reviewName.trim(),
          rating: reviewRating,
          text: reviewText.trim(),
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error || 'تعذر إرسال التقييم')
      }

      setReviewName('')
      setReviewText('')
      setReviewRating(5)
      setSubmitMessage('شكراً لك! تم إرسال تقييمك بنجاح.')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'تعذر إرسال التقييم')
    } finally {
      setIsSubmitting(false)
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
            <div className="text-3xl font-bold text-white">{happyCustomers.toLocaleString()}+</div>
            <div className="text-white/50 text-sm mt-2">عملاء سعداء</div>
          </div>
          <div className="w-px bg-white/10 hidden sm:block" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-white/50 text-sm mt-2">دولة</div>
          </div>
        </motion.div>

        <motion.div
          {...scrollReveal}
          className="mt-16 max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[#0B0033]/60 p-6 md:p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-2 text-center">شاركنا رأيك</h3>
          <p className="text-white/60 text-center mb-6">اكتب تقييمك ليظهر لزوار الموقع بعد المراجعة.</p>

          <form onSubmit={submitReview} className="space-y-4">
            <input
              type="text"
              placeholder="اسمك"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              className="w-full rounded-lg bg-black/30 border border-white/20 p-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#7B2EFF]"
              required
            />

            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="w-full rounded-lg bg-black/30 border border-white/20 p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#7B2EFF]"
            >
              <option value={5}>5 نجوم</option>
              <option value={4}>4 نجوم</option>
              <option value={3}>3 نجوم</option>
              <option value={2}>2 نجوم</option>
              <option value={1}>1 نجمة</option>
            </select>

            <textarea
              placeholder="اكتب رأيك بالخدمة"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full min-h-28 rounded-lg bg-black/30 border border-white/20 p-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#7B2EFF]"
              required
            />

            {submitMessage && (
              <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-emerald-100 text-sm">
                {submitMessage}
              </div>
            )}

            {submitError && (
              <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-rose-100 text-sm">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#7B2EFF] to-[#5B1EDF] hover:from-[#8B3EFF] hover:to-[#6B2EEF]"
            >
              {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال التقييم'}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
