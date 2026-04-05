'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, Film, Tv, Baby, Newspaper, Globe,
  Star
} from 'lucide-react'
import { scrollReveal } from '@/lib/animations'
import type { ContentCategory, ContentItem } from '@/lib/db'

interface ContentShowcaseProps {
  categories: (ContentCategory & { items: ContentItem[] })[]
}

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Film,
  Tv,
  Baby,
  Newspaper,
  Globe,
}

type ShowcaseItem = {
  id: string
  title: string
  description: string
  year?: string
  rating?: string
  image: string
  wikiQuery?: string
}

type ShowcaseCategory = {
  id: string
  name: string
  description: string
  icon: string
  items: ShowcaseItem[]
}

const placeholderPoster = () => '/placeholder.jpg'

const channelLogo = (domain: string) =>
  `https://logo.clearbit.com/${domain}`

const channelFallbackLogo = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=256&domain_url=${encodeURIComponent(`https://${domain}`)}`

const channelDomainByTitle: Record<string, string> = {
  'MBC Group': 'mbc.net',
  'OSN Movies': 'osn.com',
  HBO: 'hbo.com',
  'Netflix TV': 'netflix.com',
  Shahed: 'shahid.mbc.net',
  'UEFA Champions League': 'uefa.com',
  'English Premier League': 'premierleague.com',
  'La Liga': 'laliga.com',
  'Serie A': 'legaseriea.it',
  Bundesliga: 'bundesliga.com',
  'FIFA World Cup': 'fifa.com',
  'beIN Sports 4K': 'beinsports.com',
  'beIN Sports Premium': 'beinsports.com',
  'SSC Sports (Saudi League)': 'ssc.sa',
  'Sky Sports': 'skysports.com',
  'TNT Sports (BT Sport)': 'tntsports.co.uk',
  ESPN: 'espn.com',
  aljazera: 'aljazeera.net',
  'islamic channels': 'islamchannel.tv',
  mekka: 'makkahlive.net',
  quran: 'qurantv.sa',
}

const channelLocalFallbackByTitle: Record<string, string> = {
  'La Liga': '/channel-logos/laliga-real-style.svg',
  'FIFA World Cup': '/channel-logos/fifa-world-cup-real-style.svg',
  'UEFA Champions League': '/channel-logos/champions-league.svg',
}

const forcedPosterByTitle: Record<string, string> = {
  cukur:
    'https://cdn-images.dzcdn.net/images/cover/7186ff74fa831b982a3cff3c212240eb/0x1900-000000-80-0-0.jpg',
  'çukur':
    'https://cdn-images.dzcdn.net/images/cover/7186ff74fa831b982a3cff3c212240eb/0x1900-000000-80-0-0.jpg',
}

const getForcedPoster = (title?: string) => {
  const key = String(title || '').trim().toLowerCase()
  if (key.includes('cukur') || key.includes('çukur')) {
    return 'https://cdn-images.dzcdn.net/images/cover/7186ff74fa831b982a3cff3c212240eb/0x1900-000000-80-0-0.jpg'
  }
  return forcedPosterByTitle[key]
}

const curatedCategories: ShowcaseCategory[] = [
  {
    id: 'movies',
    name: 'أفلام',
    description: 'أفضل الأفلام العالمية والعربية في مكتبة واحدة.',
    icon: 'Film',
    items: [
      { id: 'movie-1', title: 'The Shawshank Redemption', description: 'Drama', year: '1994', rating: '9.3', image: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg' },
      { id: 'movie-2', title: 'The Godfather', description: 'Crime', year: '1972', rating: '9.2', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
      { id: 'movie-3', title: 'The Dark Knight', description: 'Action', year: '2008', rating: '9.0', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
      { id: 'movie-4', title: 'The Godfather Part II', description: 'Crime', year: '1974', rating: '9.0', image: 'https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg' },
      { id: 'movie-5', title: '12 Angry Men', description: 'Drama', year: '1957', rating: '9.0', image: 'https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg' },
      { id: 'movie-6', title: 'Schindler’s List', description: 'History', year: '1993', rating: '9.0', image: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg' },
      { id: 'movie-7', title: 'The Lord of the Rings: The Return of the King', description: 'Fantasy', year: '2003', rating: '9.0', image: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg' },
      { id: 'movie-8', title: 'Joker', description: 'Drama Thriller', year: '2019', rating: '8.4', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
      { id: 'movie-9', title: 'Fight Club', description: 'Drama', year: '1999', rating: '8.8', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
      { id: 'movie-10', title: 'Forrest Gump', description: 'Drama', year: '1994', rating: '8.8', image: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg' },
      { id: 'movie-11', title: 'Inception', description: 'Sci-Fi', year: '2010', rating: '8.8', image: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg' },
      { id: 'movie-12', title: 'Interstellar', description: 'Sci-Fi', year: '2014', rating: '8.7', image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
      { id: 'movie-13', title: 'The Matrix', description: 'Sci-Fi', year: '1999', rating: '8.7', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
      { id: 'movie-14', title: 'Gladiator', description: 'Epic', year: '2000', rating: '8.5', image: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg' },
      { id: 'movie-15', title: 'Titanic', description: 'Romance', year: '1997', rating: '7.9', image: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg' },
      { id: 'movie-16', title: 'Avatar', description: 'Sci-Fi', year: '2009', rating: '7.8', image: 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg' },
      { id: 'movie-17', title: 'Oppenheimer', description: 'Biography', year: '2023', rating: '8.3', image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
      { id: 'movie-18', title: 'Dune: Part Two', description: 'Sci-Fi', year: '2024', rating: '8.5', image: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg' },
      { id: 'movie-19', title: 'Avengers: Endgame', description: 'Action', year: '2019', rating: '8.4', image: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
      { id: 'movie-20', title: 'Parasite', description: 'Thriller Drama', year: '2019', rating: '8.5', image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
    ],
  },
  {
    id: 'series',
    name: 'مسلسلات',
    description: 'تشكيلة مميزة من أشهر المسلسلات العالمية والعربية والتركية.',
    icon: 'Tv',
    items: [
      { id: 'series-1', title: 'Breaking Bad', description: 'Crime Drama', year: '2008', rating: '9.5', image: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg' },
      { id: 'series-2', title: 'Game of Thrones', description: 'Fantasy Drama', year: '2011', rating: '9.2', image: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg' },
      { id: 'series-3', title: 'Chernobyl', description: 'Historical Drama', year: '2019', rating: '9.3', image: 'https://image.tmdb.org/t/p/w500/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg' },
      { id: 'series-4', title: 'Dark', description: 'Sci-Fi Mystery', year: '2017', rating: '8.7', image: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg' },
      { id: 'series-5', title: 'Stranger Things', description: 'Sci-Fi Horror', year: '2016', rating: '8.7', image: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg' },
      { id: 'series-6', title: 'The Last of Us', description: 'Drama', year: '2023', rating: '8.7', image: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg' },
      { id: 'series-7', title: 'Peaky Blinders', description: 'Crime', year: '2013', rating: '8.8', image: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg' },
      { id: 'series-8', title: 'The Sopranos', description: 'Crime Drama', year: '1999', rating: '9.2', image: 'https://image.tmdb.org/t/p/w500/rTc7ZXdroqjkKivFPvCPX0Ru7uw.jpg' },
      { id: 'series-9', title: 'Better Call Saul', description: 'Crime Drama', year: '2015', rating: '9.0', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlZudogDC96zcQ8h1btvghFoM6Y7qQd94UNUyceBqXslnarv260_Ij7QEvSp_FNmldAci5&s=10' },
      { id: 'series-10', title: 'Vikings', description: 'Historical Drama', year: '2013', rating: '8.5', image: 'https://image.tmdb.org/t/p/w500/bQLrHIRNEkE3PdIWQrZHynQZazu.jpg' },
      { id: 'series-11', title: 'Lost', description: 'Adventure Drama', year: '2004', rating: '8.3', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS324-VHaW2F4xiVLiSeJypjjq_WilXGlVeQutDw7k_SM-PvGL9K5ofVnSeqJNahausdapp&s=10' },
      { id: 'series-12', title: 'Prison Break', description: 'Thriller', year: '2005', rating: '8.3', image: 'https://image.tmdb.org/t/p/w500/5E1BhkCgjLBlqx557Z5yzcN0i88.jpg' },
      { id: 'series-13', title: 'Al Rawabi School for Girls', description: 'Drama', year: '2021', rating: '7.5', image: 'https://m.media-amazon.com/images/M/MV5BMjZiMDkyY2EtY2EyMi00ZTE2LTk4YzktMWZhYWMzNjM5ZjAxXkEyXkFqcGc@._V1_.jpg' },
      { id: 'series-14', title: 'Kaboos', description: 'Arabic Series', year: '2024', rating: '7.4', image: 'https://m.media-amazon.com/images/M/MV5BNzIyNGQ2NTItOGFlMS00OTY5LTg1YWYtZTgwZTlmODdlYTlhXkEyXkFqcGc@._V1_.jpg' },
      { id: 'series-15', title: 'Crystal', description: 'Arabic Drama', year: '2023', rating: '7.6', image: 'https://m.media-amazon.com/images/M/MV5BOWYwZjZkZTMtYzIwZC00MjZmLWJlYzAtZjk4MmMwMWNlNGYxXkEyXkFqcGc@._V1_.jpg' },
      { id: 'series-16', title: 'Al Hayba', description: 'Arabic Drama', year: '2017', rating: '7.8', image: 'https://shahid.mbc.net/mediaObject/2021/Amr/movies/Poster_title_alhayba_5_en/original/Poster_title_alhayba_5_en.jpg' },
      { id: 'series-18', title: 'Teşkilat', description: 'Turkish Action Drama', year: '2021', rating: '7.2', image: 'https://m.media-amazon.com/images/M/MV5BMGZkYzRjYmEtMDhlNC00ODU5LWFiOWUtYTBkNWNkMzIzNWY4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
      { id: 'series-19', title: 'Çukur', description: 'Turkish Crime Drama', year: '2017', rating: '7.7', image: 'https://cdn-images.dzcdn.net/images/cover/7186ff74fa831b982a3cff3c212240eb/0x1900-000000-80-0-0.jpg' },
      { id: 'series-20', title: 'تحت الأرض', description: 'Arabic Drama', year: '2024', rating: '7.4', image: 'https://m.media-amazon.com/images/M/MV5BMWZkN2M5NzUtODY0Zi00YzY4LTg4MDAtOWU2MDFjODQ2NGJmXkEyXkFqcGc@._V1_QL75_UY207_CR13,0,140,207_.jpg' },
      { id: 'series-21', title: 'Ashraf Tek', description: 'Arabic Drama', year: '2024', rating: '7.4', image: 'https://m.media-amazon.com/images/M/MV5BYzI5MjM5NDMtNTFjZC00ZTI0LWJjMWQtZjQyNzdiYWY2ZjUyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
    ],
  },
  {
    id: 'channels',
    name: 'قنوات',
    description: 'قنوات ترفيهية ورياضية وإخبارية ودينية من أشهر الشبكات.',
    icon: 'Globe',
    items: [
      { id: 'channel-13', title: 'beIN Sports Premium', description: 'Premium Sports', image: channelLogo('beinsports.com') },
      { id: 'channel-8', title: 'La Liga', description: 'Spanish Football', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/LaLiga_logo_2023.svg/1280px-LaLiga_logo_2023.svg.png' },
      { id: 'channel-11', title: 'FIFA World Cup', description: 'Global Football', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/250px-2026_FIFA_World_Cup_emblem.svg.png' },
      { id: 'channel-6', title: 'UEFA Champions League', description: 'European Football', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/UEFA_Champions_League.svg/1280px-UEFA_Champions_League.svg.png' },
      { id: 'channel-12', title: 'beIN Sports 4K', description: 'Sports UHD', image: channelLogo('beinsports.com') },
      { id: 'channel-1', title: 'MBC Group', description: 'Entertainment Network', image: channelLogo('mbc.net') },
      { id: 'channel-2', title: 'OSN Movies', description: 'Movies Channel', image: 'https://estaghni.com/uploads/products/1702764994.png' },
      { id: 'channel-3', title: 'HBO', description: 'Premium Entertainment', image: 'https://www.hollywoodreporter.com/wp-content/uploads/2012/08/hbo_logo.jpg?w=1440&h=810&crop=1' },
      { id: 'channel-4', title: 'Netflix TV', description: 'Streaming Entertainment', image: channelLogo('netflix.com') },
      { id: 'channel-5', title: 'Shahed', description: 'Arabic Streaming', image: channelLogo('shahid.mbc.net') },
      { id: 'channel-7', title: 'English Premier League', description: 'Football League', image: channelLogo('premierleague.com') },
      { id: 'channel-9', title: 'Serie A', description: 'Italian Football', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa4X4Oa75oDFLlBG-SWbuHOEpXDsXgYfH-XA&s' },
      { id: 'channel-10', title: 'Bundesliga', description: 'German Football', image: channelLogo('bundesliga.com') },
      { id: 'channel-14', title: 'SSC Sports (Saudi League)', description: 'Saudi Sports', image: '/channel-logos/saudi-league.svg' },
      { id: 'channel-15', title: 'Sky Sports', description: 'Sports Channel', image: '/channel-logos/sky-sports.svg' },
      { id: 'channel-16', title: 'TNT Sports (BT Sport)', description: 'Sports Channel', image: channelLogo('tntsports.co.uk') },
      { id: 'channel-17', title: 'ESPN', description: 'Sports Network', image: channelLogo('espn.com') },
      { id: 'channel-18', title: 'aljazera', description: 'News Network', image: 'https://yt3.googleusercontent.com/oN_i26ADOuQ4PdypHo8yjVXh6QSXZ1kMeYzaRH3hNOlQE1uEUUQ-gkCh0o1rUQ2PM7Qx6QvY2g=s900-c-k-c0x00ffffff-no-rj' },
      { id: 'channel-19', title: 'islamic channels', description: 'Religious Content', image: '/channel-logos/islamic-channels.svg' },
      { id: 'channel-20', title: 'mekka', description: 'Makkah Live', image: 'https://thumbs.dreamstime.com/b/mecca-saudi-arabia-may-holy-kaaba-center-islam-located-masjid-al-haram-mecca-holy-kaaba-center-320337443.jpg' },
      { id: 'channel-21', title: 'quran', description: 'Holy Quran', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWZJ9COBw577GtaD2_TjOYLl_gzIK_WkIMeg&s' },
    ],
  },
]

export function ContentShowcase({ categories }: ContentShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [resolvedImages, setResolvedImages] = useState<Record<string, string>>({})
  const normalizedFromDb: ShowcaseCategory[] = categories
    .filter((category) => Array.isArray(category.items) && category.items.length > 0)
    .map((category) => {
      const nameLower = (category.name || '').toLowerCase()
      let icon = 'Tv'
      if (/movie|film|افلام|أفلام/.test(nameLower)) icon = 'Film'
      else if (/series|مسلسلات/.test(nameLower)) icon = 'Tv'
      else if (/sport|رياض/.test(nameLower)) icon = 'Trophy'
      else if (/news|اخبار|أخبار/.test(nameLower)) icon = 'Newspaper'
      else if (/kid|اطفال|أطفال/.test(nameLower)) icon = 'Baby'
      else if (/live|channel|قنوات|tv/.test(nameLower)) icon = 'Globe'

      return {
        id: String(category.id),
        name: category.name,
        description: category.description || 'محتوى محدث باستمرار',
        icon,
        items: category.items.map((item) => ({
          id: String(item.id),
          title: item.title,
          description: item.description || category.name,
          year: item.year || undefined,
          rating: item.rating || undefined,
          image: getForcedPoster(item.title) || item.poster_url || item.thumbnail_url || '',
        })),
      }
    })

  const showcaseCategories = normalizedFromDb.length > 0 ? normalizedFromDb : curatedCategories
  const activeItems = showcaseCategories[activeCategory]?.items || []
  const activeCategoryMeta = showcaseCategories[activeCategory]
  const isChannelsCategory = Boolean(
    activeCategoryMeta &&
      (activeCategoryMeta.id === 'channels' ||
        activeCategoryMeta.icon === 'Globe' ||
        /قنوات|channels/i.test(activeCategoryMeta.name))
  )
  const safeLength = activeItems.length || 1
  useEffect(() => {
    if (activeCategory >= showcaseCategories.length) {
      setActiveCategory(0)
    }
  }, [activeCategory, showcaseCategories.length])

  useEffect(() => {
    setActiveIndex(0)
  }, [activeCategory])

  useEffect(() => {
    if (activeItems.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeLength)
    }, 2800)

    return () => clearInterval(interval)
  }, [activeItems.length, safeLength])

  useEffect(() => {
    const unresolved = activeItems.filter((item) => !item.image && item.wikiQuery && !resolvedImages[item.id])
    if (!unresolved.length) return

    let cancelled = false

    const resolveWikipediaImages = async () => {
      const updates: Record<string, string> = {}

      for (const item of unresolved) {
        const query = item.wikiQuery || item.title
        const endpoints = [
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
          `https://ar.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
          `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
        ]

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint)
            if (!response.ok) continue
            const data = await response.json()
            const imageUrl = data?.thumbnail?.source || data?.originalimage?.source
            if (typeof imageUrl === 'string' && imageUrl.length > 0) {
              updates[item.id] = imageUrl
              break
            }
          } catch {
            // Ignore fetch failures and keep trying other sources.
          }
        }
      }

      if (!cancelled && Object.keys(updates).length) {
        setResolvedImages((prev) => ({ ...prev, ...updates }))
      }
    }

    void resolveWikipediaImages()

    return () => {
      cancelled = true
    }
  }, [activeItems, resolvedImages])

  const visibleItems = Array.from({ length: Math.min(4, safeLength) }).map((_, idx) => {
    const item = activeItems[(activeIndex + idx) % safeLength]
    return item || {
      id: `placeholder-${idx}`,
      title: 'Content',
      description: 'Updated daily',
      image: placeholderPoster(),
    }
  })

  return (
    <section id="content" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7B2EFF]/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          {...scrollReveal}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#7B2EFF]/20 text-[#7B2EFF] text-sm font-medium mb-4">
            مكتبة المحتوى
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            ترفيه بلا حدود
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            اكتشف مجموعة ضخمة من القنوات والأفلام والمسلسلات
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          {...scrollReveal}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {showcaseCategories.map((category, index) => {
            const Icon = iconMap[category.icon || 'Tv'] || Tv
            const isActive = activeCategory === index

            return (
              <motion.button
                key={category.id}
                onClick={() => {
                  setActiveCategory(index)
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#7B2EFF] text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{category.name}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Moving 4-up cards */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {visibleItems.map((item, idx) => (
              <motion.div
                key={`${item.id}-${activeCategory}-${activeIndex}-${idx}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: idx * 0.06 }}
                className="group relative rounded-xl overflow-hidden bg-[#0B0033] border border-white/10 hover:border-[#7B2EFF]/50 transition-all"
              >
                <div className={`relative overflow-hidden ${isChannelsCategory ? 'aspect-[16/10] bg-white/95' : 'aspect-[2/3] bg-gradient-to-br from-[#7B2EFF]/30 to-[#0B0033]'}`}>
                  <img
                    src={resolvedImages[item.id] || item.image || placeholderPoster(item.title)}
                    alt={item.title}
                    className={`absolute inset-0 h-full w-full ${isChannelsCategory ? 'object-contain p-5' : 'object-cover object-center'}`}
                    loading="lazy"
                    onError={(event) => {
                      const element = event.currentTarget
                      if (element.dataset.fallbackApplied === '1') return
                      element.dataset.fallbackApplied = '1'
                      if (isChannelsCategory) {
                        const localFallback = channelLocalFallbackByTitle[item.title]
                        if (localFallback) {
                          element.src = localFallback
                          return
                        }
                        const domain = channelDomainByTitle[item.title]
                        element.src = domain ? channelFallbackLogo(domain) : placeholderPoster()
                        return
                      }
                      element.src = placeholderPoster()
                    }}
                  />
                  <div className={`absolute inset-0 ${isChannelsCategory ? 'bg-transparent' : 'bg-gradient-to-t from-[#0B0033] via-[#0B0033]/35 to-transparent'}`} />
                  {item.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[11px] text-white font-medium">{item.rating}</span>
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-medium text-sm text-white line-clamp-2 min-h-[2.5rem]">{item.title}</h4>
                  <p className="text-xs text-white/55 mt-1 line-clamp-1">{item.description}</p>
                  {item.year && <span className="inline-block mt-1 text-[11px] text-white/40">{item.year}</span>}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-white/40 mt-4">
            عرض متحرك تلقائياً: 4 صور صغيرة تتبدل باستمرار
          </p>
        </div>

        {/* Category description */}
        <motion.div
          {...scrollReveal}
          className="mt-10 text-center"
        >
          <p className="text-white/50 max-w-xl mx-auto">
            {showcaseCategories[activeCategory]?.description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
