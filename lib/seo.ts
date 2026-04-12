export const generateStructuredData = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://studo-iptv.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Studo IPTV',
    description: 'Premium IPTV streaming service with unlimited channels, movies, and series',
    url: baseUrl,
    logo: `${baseUrl}/logo.jpg`,
    sameAs: [
      'https://www.instagram.com/studo_iptv',
      'https://facebook.com/studo-iptv',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      telephone: '+970599765211',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Palestine',
    },
  }
}

export const generateProductSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Studo IPTV Subscription',
    description: 'Premium IPTV streaming service with 8000+ channels, 19000+ movies, 8500+ series',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '50+',
    },
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'ILS',
    },
  }
}

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export const structuredDataToScript = (data: any) => {
  return JSON.stringify(data, null, 2)
}
