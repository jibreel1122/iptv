import type { ContentCategory, ContentItem, Feature, Offer, Order, Review, Setting, Stats } from '@/lib/db'

const now = new Date().toISOString()

export const fallbackStats: Stats = {
  id: 1,
  channels: 8000,
  movies: 19000,
  series: 8500,
  updated_at: now,
}

export const fallbackSettingsRows: Setting[] = [
  { id: 1, key: 'hero_title', value: 'عيش الترفيه بجودة ممتازة', type: 'text', label: 'Hero Title', category: 'hero', updated_at: now },
  { id: 2, key: 'hero_subtitle', value: 'شاهد آلاف القنوات والأفلام والمسلسلات بجودة 4K', type: 'textarea', label: 'Hero Subtitle', category: 'hero', updated_at: now },
  { id: 3, key: 'hero_cta_text', value: 'اطلب الآن', type: 'text', label: 'Hero CTA', category: 'hero', updated_at: now },
  { id: 4, key: 'whatsapp_number', value: '+970599765211', type: 'text', label: 'WhatsApp', category: 'contact', updated_at: now },
  { id: 5, key: 'social_instagram', value: 'https://www.instagram.com/studo_iptv', type: 'text', label: 'Instagram', category: 'social', updated_at: now },
  { id: 6, key: 'brand_name', value: 'Studo', type: 'text', label: 'Brand', category: 'branding', updated_at: now },
]

export const fallbackOffers: Offer[] = [
  { id: 1, title: 'اشتراك 3 أشهر', duration: '3 أشهر', price: 39, old_price: 49, badge: 'الأكثر طلباً', sales_counter: 13, features: ['كل القنوات المباشرة', 'مكتبة أفلام ومسلسلات ضخمة', 'جودة HD/4K', 'دعم فني 24/7'], position: 1, active: true, created_at: now, updated_at: now },
  { id: 2, title: 'اشتراك 6 أشهر', duration: '6 أشهر', price: 70, old_price: 89, badge: 'أفضل سعر', sales_counter: 9, features: ['كل القنوات المباشرة', 'محتوى يتجدد يومياً', 'تفعيل سريع', 'دعم فني 24/7'], position: 2, active: true, created_at: now, updated_at: now },
  { id: 3, title: 'اشتراك سنة + 3 أشهر مجاناً', duration: '15 شهر', price: 119, old_price: 159, badge: 'عرض قوي', sales_counter: 7, features: ['كل القنوات والمكتبة', 'بدون تقطيع', 'أولوية في الدعم', 'تجربة مجانية ليوم'], position: 3, active: true, created_at: now, updated_at: now },
  { id: 4, title: 'اشتراك سنتين', duration: '24 شهر', price: 220, old_price: 299, badge: 'الأوفر', sales_counter: 5, features: ['أفضل قيمة طويلة المدى', 'استقرار عالي', 'تحديثات مستمرة', 'دعم فني كامل'], position: 4, active: true, created_at: now, updated_at: now },
]

export const fallbackFeatures: Feature[] = [
  { id: 1, title: 'جودة عالية', description: 'بث مستقر بجودة HD و 4K', icon: 'Monitor', position: 1, active: true, created_at: now },
  { id: 2, title: 'سيرفرات قوية', description: 'استقرار ممتاز بدون تقطيع', icon: 'Zap', position: 2, active: true, created_at: now },
  { id: 3, title: 'دعم دائم', description: 'فريق دعم على مدار الساعة', icon: 'Headphones', position: 3, active: true, created_at: now },
]

export const fallbackCategories: ContentCategory[] = [
  { id: 1, name: 'أفلام', description: 'مكتبة أفلام كبيرة', icon: 'Film', position: 1, active: true, created_at: now },
  { id: 2, name: 'مسلسلات', description: 'أفضل المسلسلات', icon: 'Tv', position: 2, active: true, created_at: now },
  { id: 3, name: 'قنوات مباشرة', description: 'قنوات محلية وعالمية', icon: 'Globe', position: 3, active: true, created_at: now },
]

export const fallbackItems: ContentItem[] = [
  { id: 1, category_id: 1, title: 'أكشن 2026', description: 'أفلام أكشن حديثة', year: '2026', rating: '8.7', position: 1, active: true, created_at: now },
  { id: 2, category_id: 2, title: 'دراما حصرية', description: 'مسلسلات درامية', year: '2026', rating: '8.9', position: 2, active: true, created_at: now },
  { id: 3, category_id: 3, title: 'قنوات رياضية', description: 'أقوى البطولات', year: '2026', rating: '9.1', position: 3, active: true, created_at: now },
]

export const fallbackReviews: Review[] = [
  { id: 1, username: 'user1032', rating: 5, text: 'الخدمة ممتازة وسريعة جدا', country: 'PS', position: 1, active: true, created_at: now },
  { id: 2, username: 'user4481', rating: 5, text: 'أفضل اشتراك IPTV جربته', country: 'JO', position: 2, active: true, created_at: now },
]

export const fallbackOrders: Order[] = []
