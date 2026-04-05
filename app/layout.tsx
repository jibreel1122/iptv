import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { generateStructuredData, generateProductSchema } from '@/lib/seo'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Studo IPTV - Premium Entertainment Streaming',
  description: 'Experience premium IPTV streaming with 8000+ live channels, 19000+ movies, and 8500+ series in stunning 4K quality. Stream on all your devices.',
  keywords: ['IPTV', 'streaming', 'live TV', 'movies', 'series', '4K', 'HD', 'entertainment'],
  authors: [{ name: 'Studo IPTV' }],
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    url: 'https://studo.tv',
    siteName: 'Studo IPTV',
    title: 'Studo IPTV - Premium Entertainment Streaming',
    description: 'Experience premium IPTV streaming with 8000+ live channels, 19000+ movies, and 8500+ series in stunning 4K quality.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Studo IPTV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studo IPTV - Premium Entertainment Streaming',
    description: 'Experience premium IPTV streaming with 8000+ live channels, 19000+ movies, and 8500+ series.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#7B2EFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = generateStructuredData()
  const productSchema = generateProductSchema()

  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        {/* JSON-LD Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        
        {/* Meta Tags for Search Engines */}
        <meta name="google-site-verification" content="your-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Sitemap */}
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="canonical" href="https://studo-iptv.com" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-sans antialiased min-h-screen bg-[#050019] text-white overflow-x-hidden`}
      >
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(11, 0, 51, 0.95)',
              border: '1px solid rgba(123, 46, 255, 0.3)',
              color: '#fff',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
