import { Metadata } from 'next'
import Link from 'next/link'
import { ParticleBackground } from '@/components/particle-background'
import { HeroSection } from '@/components/hero-section'
import { OffersSection } from '@/components/offers-section'
import { FeaturesSection } from '@/components/features-section'
import { ContentShowcase } from '@/components/content-showcase'
import { ReviewsSection } from '@/components/reviews-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'
import { ErrorBoundary } from '@/components/error-boundary'
import { TopToolbar } from '@/components/top-toolbar'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { TrialPopup } from '@/components/trial-popup'
import { hasDatabase, sql, type ContentCategory, type ContentItem, type Feature, type Offer, type Review, type Setting, type Stats } from '@/lib/db'
import { getAutoGrowingStats } from '@/lib/stats'
import { fallbackCategories, fallbackFeatures, fallbackItems, fallbackOffers, fallbackReviews, fallbackSettingsRows, fallbackStats } from '@/lib/fallback-data'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'ستودو IPTV - تجربة بث متكاملة',
  description: 'شاهد آلاف القنوات والأفلام والمسلسلات بجودة عالية مع تفعيل سريع ودعم دائم. جرّب الخدمة مجاناً ليوم واحد عبر واتساب.',
  keywords: 'IPTV, بث مباشر, قنوات, أفلام, مسلسلات',
  openGraph: {
    title: 'ستودو IPTV - تجربة بث متكاملة',
    description: 'شاهد آلاف القنوات والأفلام والمسلسلات بجودة عالية',
    type: 'website',
    siteName: 'ستودو IPTV',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const dynamic = 'force-dynamic'

const backgroundWords = [
  'اشترك الآن',
  'مشاهدة بلا تقطيع',
  'جودة 4K',
  'جرّب مجاناً',
  'أفضل العروض',
  'تفعيل فوري',
  'لا تفوّت العرض',
  'قيمة أعلى بسعر أقل',
  'دعم فني سريع',
  'محتوى يتجدد يومياً',
]

export default async function Home() {
  let settingsRows: Setting[] = fallbackSettingsRows
  let statsRows: Stats[] = [fallbackStats]
  let offers: Offer[] = fallbackOffers.filter((offer) => offer.active).sort((a, b) => a.position - b.position)
  let features: Feature[] = fallbackFeatures
  let categories: ContentCategory[] = fallbackCategories
  let items: ContentItem[] = fallbackItems
  let reviews: Review[] = fallbackReviews

  if (hasDatabase) {
    try {
      const [dbSettings, dbStats, dbOffers, dbCategories, dbItems, dbReviews] = await Promise.all([
        sql`SELECT * FROM settings ORDER BY category, key`,
        sql`SELECT * FROM stats LIMIT 1`,
        sql`SELECT * FROM offers WHERE active = true ORDER BY position ASC`,
        sql`SELECT * FROM content_categories WHERE active = true ORDER BY position ASC`,
        sql`SELECT * FROM content_items WHERE active = true ORDER BY position ASC`,
        sql`SELECT * FROM reviews WHERE active = true ORDER BY position ASC`,
      ])

      settingsRows = (dbSettings as Setting[]) ?? fallbackSettingsRows
      statsRows = ((dbStats as Stats[])?.length ? (dbStats as Stats[]) : [fallbackStats])
      offers = (dbOffers as Offer[]) ?? []
      categories = (dbCategories as ContentCategory[]) ?? fallbackCategories
      items = (dbItems as ContentItem[]) ?? fallbackItems
      reviews = (dbReviews as Review[]) ?? fallbackReviews
    } catch {
      // Keep fallback data so the page always renders even if the DB is unreachable.
    }
  }

  if (!hasDatabase && hasSupabasePublicConfig) {
    try {
      const supabase = getSupabaseServerClient()
      const [settingsRes, statsRes, offersRes, categoriesRes, itemsRes, reviewsRes] = await Promise.all([
        supabase.from('settings').select('*').order('category', { ascending: true }).order('key', { ascending: true }),
        supabase.from('stats').select('*').limit(1),
        supabase.from('offers').select('*').eq('active', true).order('position', { ascending: true }),
        supabase.from('content_categories').select('*').eq('active', true).order('position', { ascending: true }),
        supabase.from('content_items').select('*').eq('active', true).order('position', { ascending: true }),
        supabase.from('reviews').select('*').eq('active', true).order('position', { ascending: true }),
      ])

      settingsRows = (settingsRes.data as Setting[]) ?? settingsRows
      statsRows = (statsRes.data?.length ? (statsRes.data as Stats[]) : statsRows)
      offers = (offersRes.data as Offer[]) ?? offers
      categories = (categoriesRes.data as ContentCategory[]) ?? categories
      items = (itemsRes.data as ContentItem[]) ?? items
      reviews = (reviewsRes.data as Review[]) ?? reviews
    } catch {
      // Keep fallback data for resilience in supabase mode.
    }
  }

  const settings: Record<string, string> = {}
  settingsRows.forEach((s) => {
    settings[s.key] = s.value
  })

  const dynamicStats = getAutoGrowingStats(statsRows[0] || null)
  const groupedCategories = categories.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.category_id === cat.id),
  }))

  return (
    <main className="relative min-h-screen overflow-hidden">
      <TopToolbar />
      <ParticleBackground />
      <div className="pointer-events-none absolute inset-0 z-[1]">
        {backgroundWords.map((word, idx) => (
          <span
            key={word + idx}
            className="absolute text-white/5 font-bold text-2xl sm:text-4xl"
            style={{
              top: `${8 + idx * 14}%`,
              left: idx % 2 === 0 ? '6%' : '62%',
              transform: `rotate(${idx % 2 === 0 ? -14 : 12}deg)`,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <Link href="/about" className="fixed top-20 left-4 z-50 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white hover:bg-black/60">
        ما هو هذا الموقع؟
      </Link>

      <div className="relative z-10 pt-16">
        <ErrorBoundary>
          <HeroSection settings={settings} stats={dynamicStats} />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <OffersSection offers={offers} />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <FeaturesSection features={features} />
        </ErrorBoundary>

        <HowItWorksSection />

        <ErrorBoundary>
          <ContentShowcase categories={groupedCategories} />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <ReviewsSection reviews={reviews} />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <ContactSection />
        </ErrorBoundary>

        <Footer />
      </div>

      <TrialPopup />
    </main>
  )
}
