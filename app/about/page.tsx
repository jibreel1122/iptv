import Link from 'next/link'
import { Footer } from '@/components/footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050019] text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">ما هو هذا الموقع؟</h1>
        <p className="text-white/80 text-lg leading-8 mb-8">
          هذا الموقع هو منصة IPTV عربية تساعدك للوصول إلى القنوات المباشرة، الأفلام، والمسلسلات من مكان واحد.
          نركز على جودة المشاهدة، السرعة، الاستقرار، وسهولة الاشتراك بخطوات بسيطة.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <h2 className="text-xl font-semibold mb-2">ماذا نقدم؟</h2>
            <p className="text-white/70">قنوات مباشرة، مكتبة أفلام ومسلسلات، ومحتوى يتجدد باستمرار مع جودة عرض عالية.</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <h2 className="text-xl font-semibold mb-2">كيف أبدأ؟</h2>
            <p className="text-white/70">اختر الباقة المناسبة ثم أرسل طلبك مباشرة أو تواصل معنا عبر واتساب.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 mb-5">
          <h2 className="text-xl font-semibold mb-3">لماذا يختارنا العملاء؟</h2>
          <ul className="space-y-2 text-white/75">
            <li>تفعيل سريع بعد الطلب.</li>
            <li>دعم فني متواصل لمساعدتك في أي وقت.</li>
            <li>مكتبة كبيرة من القنوات والأفلام والمسلسلات.</li>
            <li>إمكانية تجربة الخدمة ليوم واحد مجاناً قبل الاشتراك.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-green-400/30 bg-green-500/10 p-5 mb-8">
          <p className="text-green-200 font-semibold">نوفر تجربة مجانية ليوم واحد. تواصل معنا على واتساب للبدء.</p>
        </div>

        <Link href="/" className="inline-block rounded-full bg-[#7B2EFF] px-6 py-3 font-semibold hover:bg-[#6B1EEF]">
          العودة للرئيسية
        </Link>
      </div>
      <Footer />
    </main>
  )
}
