import Link from 'next/link'
import { hasDatabase, sql, type Offer, type Setting } from '@/lib/db'
import { fallbackOffers, fallbackSettingsRows } from '@/lib/fallback-data'
import { Footer } from '@/components/footer'
import { getSupabaseServerClient, hasSupabasePublicConfig } from '@/lib/supabase-server'

export default async function OrderPage({
  searchParams,
}: {
  searchParams?: Promise<{ offer?: string; success?: string }>
}) {
  const params = (await searchParams) || {}
  const selectedOfferId = Number(params.offer || 0)
  const isSuccess = params.success === '1'

  let offers: Offer[] = fallbackOffers.filter((offer) => offer.active).sort((a, b) => a.position - b.position)
  let settingRows: Setting[] = fallbackSettingsRows.filter((s) => s.key === 'whatsapp_number')

  if (hasDatabase) {
    const [dbOffers, dbSettingRows] = await Promise.all([
      sql`SELECT * FROM offers WHERE active = true ORDER BY position ASC`,
      sql`SELECT * FROM settings WHERE key = 'whatsapp_number' LIMIT 1`,
    ])
    offers = (dbOffers as Offer[]) ?? offers
    settingRows = (dbSettingRows as Setting[]) ?? settingRows
  } else if (hasSupabasePublicConfig) {
    try {
      const supabase = getSupabaseServerClient()
      const [offersRes, settingsRes] = await Promise.all([
        supabase.from('offers').select('*').eq('active', true).order('position', { ascending: true }),
        supabase.from('settings').select('*').eq('key', 'whatsapp_number').limit(1),
      ])

      offers = (offersRes.data as Offer[]) ?? offers
      settingRows = (settingsRes.data as Setting[]) ?? settingRows
    } catch {
      // Keep fallback values if Supabase request fails.
    }
  }

  const whatsapp = ((settingRows[0] as Setting | undefined)?.value || '+970599765211').replace(/[^\d]/g, '')
  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId)

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#2a0f63_0%,#13052c_45%,#050019_100%)] text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">اطلب اشتراكك الآن</h1>
          <p className="text-white/75 mb-2 text-lg">املأ البيانات بشكل كامل وسنتواصل معك بأسرع وقت لتأكيد الطلب.</p>
          <p className="text-white/55">الطلب يستغرق أقل من دقيقة، والتفعيل يتم بسرعة بعد التأكيد.</p>
        </div>

        {isSuccess && (
          <div className="mb-8 rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-5 py-4 text-emerald-100">
            مبروك! سوف نتواصل معك في أقرب وقت ممكن على الواتساب، أو يمكنك التواصل معنا مباشرة.
          </div>
        )}

        {selectedOffer && (
          <p className="mb-10 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-3 text-purple-200">
            الباقة المختارة: <span className="font-semibold">{selectedOffer.title}</span> - ₪{Number(selectedOffer.price).toFixed(2)}
          </p>
        )}

        {!offers.length && (
          <div className="mb-8 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-4 text-amber-100">
            لا توجد باقات متاحة حالياً. الرجاء إضافة باقات من لوحة الإدارة أولاً.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[#140537] to-[#0a0222] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <h2 className="text-2xl font-semibold mb-2">إرسال طلب مباشر</h2>
            <p className="text-white/70 mb-5 text-sm">املأ الحقول التالية: الاسم الكامل، رقم الواتساب، الباقة المطلوبة، ثم أضف ملاحظاتك إن رغبت.</p>
            <form action="/api/orders" method="post" className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-white/80">الاسم الكامل</label>
                <input
                  name="full_name"
                  required
                  placeholder="مثال: محمد أحمد"
                  className="w-full rounded-lg bg-black/40 border border-white/20 p-3 focus:outline-none focus:ring-2 focus:ring-[#7B2EFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-white/80">رقم واتساب</label>
                <input
                  name="whatsapp_number"
                  required
                  placeholder="مثال: 059xxxxxxxx"
                  className="w-full rounded-lg bg-black/40 border border-white/20 p-3 focus:outline-none focus:ring-2 focus:ring-[#7B2EFF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-white/80">الباقة المطلوبة</label>
                <select
                  name="offer_id"
                  required
                  defaultValue={selectedOfferId > 0 ? String(selectedOfferId) : ''}
                  disabled={!offers.length}
                  className="w-full rounded-lg bg-black/40 border border-white/20 p-3 focus:outline-none focus:ring-2 focus:ring-[#7B2EFF]"
                >
                  <option value="" disabled>اختر الباقة</option>
                  {offers.map((offer) => (
                    <option value={offer.id} key={offer.id}>
                      {offer.title} - ₪{Number(offer.price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-white/80">ملاحظات (اختياري)</label>
                <textarea
                  name="message"
                  placeholder="اكتب أي تفاصيل إضافية هنا"
                  className="w-full rounded-lg bg-black/40 border border-white/20 p-3 min-h-28 focus:outline-none focus:ring-2 focus:ring-[#7B2EFF]"
                />
              </div>

              <button type="submit" disabled={!offers.length} className="w-full rounded-lg bg-[#7B2EFF] py-3 font-semibold hover:bg-[#6B1EEF] transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                تأكيد الطلب
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-2">تواصل معنا على واتساب</h2>
            <p className="text-white/80 mb-3">إذا أردت مساعدة سريعة، أو عندك استفسار قبل الطلب، راسلنا مباشرة.</p>
            <p className="text-green-200 mb-5 font-semibold">تجربة مجانية ليوم واحد متاحة عبر واتساب.</p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold hover:bg-green-700"
            >
              تواصل على واتساب
            </a>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-2">معلومات مهمة قبل الاشتراك</h3>
          <ul className="space-y-2 text-white/75">
            <li>التفعيل يتم بسرعة بعد تأكيد الطلب.</li>
            <li>الأسعار المعروضة بالشيكل.</li>
            <li>يمكنك اختيار الطريقة الأنسب: طلب مباشر أو واتساب.</li>
          </ul>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-white/70 hover:text-white underline">العودة للرئيسية</Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
