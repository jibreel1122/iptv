import Link from 'next/link'

const steps = [
  {
    title: '1) اختر الباقة المناسبة',
    text: 'اختر مدة الاشتراك التي تناسبك من صفحة الأسعار.',
  },
  {
    title: '2) أرسل الطلب',
    text: 'أدخل رقم واتساب وحدد الباقة، أو تواصل معنا مباشرة.',
  },
  {
    title: '3) التفعيل السريع',
    text: 'نؤكد الطلب ونفعّل الاشتراك بسرعة مع دعم فني كامل.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-to-use" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-[#7B2EFF]/20 text-[#7B2EFF] text-sm font-medium mb-4">
            طريقة الاستخدام
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">كيف تبدأ معنا؟</h2>
          <p className="text-white/70 max-w-2xl mx-auto">خطوات بسيطة جدا لتشغيل الخدمة خلال دقائق.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/70 leading-7">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/order" className="inline-flex rounded-full bg-[#7B2EFF] hover:bg-[#6B1EEF] px-7 py-3 font-semibold text-white">
            ابدأ الطلب الآن
          </Link>
        </div>
      </div>
    </section>
  )
}
