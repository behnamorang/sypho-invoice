import Link from 'next/link'
import { Check } from 'lucide-react'
import { LogoWhite } from '@/components/Logo'
import SiteHeader from '@/components/SiteHeader'

const FREE_FEATURES = [
  'Up to 3 invoices a month',
  'Unlimited quotes',
  'Unlimited customers',
  'Professional PDF invoices with your logo and signature',
  'A public link your customers can open to view and pay',
  'Share invoices instantly over WhatsApp',
  'Track payments as they come in',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited invoices and quotes',
  'Your invoices with no Sypho branding on them',
  'Automatic reminders when a payment falls overdue',
  'Priority email support',
]

const TEAM_FEATURES = [
  'Everything in Pro',
  'Add your team so more than one person can send invoices',
  'Shared customer and invoice records across your team',
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f8] overflow-x-hidden" style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <SiteHeader />

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-12 sm:pt-14 sm:pb-16 text-center">
        <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.1] tracking-tight mb-4">
          Pricing that grows with you
        </h1>
        <p className="text-lg text-[color:var(--t2)] leading-relaxed max-w-xl mx-auto">
          Start for free and only pay when your business is big enough to need more. No contracts, no hidden fees, and no surprise price rises once you have signed up.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          <div className="rounded-2xl p-7 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm font-semibold text-[color:var(--t2)] mb-2">Free</p>
            <p className="font-display text-4xl font-extrabold mb-1">£0</p>
            <p className="text-sm text-[color:var(--t3)] mb-6">Forever, for solo tradespeople just getting started</p>
            <Link href="/signup" className="block text-center text-sm font-semibold px-5 py-3 rounded-xl mb-6 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#f0f0f8' }}>
              Start for free
            </Link>
            <ul className="space-y-3">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[color:var(--t2)]">
                  <Check size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-7 relative"
            style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.35)' }}>
            <span className="absolute -top-3 left-7 text-xs font-semibold px-3 py-1 rounded-full text-white bg-gradient-to-br from-indigo-500 to-violet-500">
              Most popular
            </span>
            <p className="text-sm font-semibold text-indigo-300 mb-2">Pro</p>
            <p className="font-display text-4xl font-extrabold mb-1">£9<span className="text-lg font-medium text-[color:var(--t3)]"> / month</span></p>
            <p className="text-sm text-[color:var(--t3)] mb-6">Or £90 a year, which works out to two months free. For tradespeople sending invoices every week.</p>
            <Link href="/signup" className="block text-center text-sm font-semibold px-5 py-3 rounded-xl mb-6 text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              Get started
            </Link>
            <ul className="space-y-3">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[color:var(--t2)]">
                  <Check size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-7 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm font-semibold text-[color:var(--t2)] mb-2">Team</p>
            <p className="font-display text-4xl font-extrabold mb-1">£19<span className="text-lg font-medium text-[color:var(--t3)]"> / month</span></p>
            <p className="text-sm text-[color:var(--t3)] mb-6">For businesses where more than one person needs to send invoices</p>
            <div className="block text-center text-sm font-semibold px-5 py-3 rounded-xl mb-6"
              style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'var(--t3)' }}>
              Coming soon
            </div>
            <ul className="space-y-3">
              {TEAM_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[color:var(--t2)]">
                  <Check size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-20 sm:pb-24">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Common questions</h2>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold mb-1">Do I need a card to start?</p>
            <p className="text-sm text-[color:var(--t2)] leading-relaxed">No. You can create your account and start sending invoices without entering any payment details.</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">What happens if I go over 3 invoices in a month on the Free plan?</p>
            <p className="text-sm text-[color:var(--t2)] leading-relaxed">You can upgrade to Pro at any point during the month to keep sending invoices without a limit. Your existing invoices and customers stay exactly as they are.</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Can I cancel at any time?</p>
            <p className="text-sm text-[color:var(--t2)] leading-relaxed">Yes. There are no contracts and no minimum commitment. Cancel whenever you like and you will not be charged again.</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Will the price change after I sign up?</p>
            <p className="text-sm text-[color:var(--t2)] leading-relaxed">If we ever change our prices, customers already on a paid plan keep the rate they signed up at. You will never be moved onto a higher price without being told first.</p>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24 sm:pb-28 text-center">
        <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/[0.08] border border-indigo-500/20 rounded-3xl px-6 py-14 sm:px-10 sm:py-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Ready to send your first invoice?</h2>
          <p className="text-[color:var(--t2)] text-[15px] mb-9">Set up your account in a couple of minutes, no card needed.</p>
          <Link href="/signup" className="inline-block text-[15px] font-semibold text-white px-9 py-3.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:brightness-110 transition-all">
            Create your free account →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-7 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <LogoWhite size="sm" />
          <p className="text-xs text-[color:var(--t3)] order-3 sm:order-2">© 2026 Sypho CRM · Built for trade and service businesses</p>
          <div className="flex gap-5 order-2 sm:order-3">
            <Link href="/login" className="text-xs text-[color:var(--t3)] hover:text-[color:var(--t2)]">Sign in</Link>
            <Link href="/signup" className="text-xs text-[color:var(--t3)] hover:text-[color:var(--t2)]">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
