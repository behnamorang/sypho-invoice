import Link from 'next/link'
import { LogoWhite } from '@/components/Logo'
import FeatureCard from './components/FeatureCard'

const STATS: [string, string][] = [
  ['2 min', 'Setup time'],
  ['∞', 'Unlimited invoices'],
  ['100%', 'UK compliant'],
  ['6', 'Currencies'],
]

const FEATURES: [string, string, string][] = [
  ['📄', 'Professional Invoices', 'UK-compliant invoices with VAT, company number, and custom branding. Export PDF in one click.'],
  ['💬', 'Send via WhatsApp', "Share invoices directly to your customer's WhatsApp with a pre-written message."],
  ['💳', 'Payment Tracking', 'Track paid, partially paid, and overdue invoices. Record payments instantly.'],
  ['📋', 'Quotations', 'Send professional quotes and convert accepted ones to invoices in one click.'],
  ['👥', 'Customer Manager', 'Store companies and individuals with full UK business details including VAT numbers.'],
  ['📊', 'Business Dashboard', 'See revenue, outstanding balance, and overdue invoices at a glance.'],
]

const TRADES = ['Painters', 'Electricians', 'Plumbers', 'Cleaners', 'Builders', 'Gardeners', 'Decorators', 'Tilers', 'Plasterers', 'Handymen']

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f8] overflow-x-hidden" style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>

      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/"><LogoWhite size="md" /></Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm text-[color:var(--t2)] hover:text-white transition-colors px-3 py-2">Sign in</Link>
          <Link href="/signup" className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 hover:brightness-110 transition-all">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 sm:pt-16 sm:pb-28 grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-3.5 py-1.5 mb-7 text-[13px] text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Built for UK service businesses
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,4.2rem)] font-extrabold leading-[1.05] tracking-tight mb-6">
            <span className="bg-gradient-to-br from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Invoices. Quotes.
            </span>
            <br />
            <span className="text-[#f0f0f8]">Customers. Done.</span>
          </h1>

          <p className="text-lg text-[color:var(--t2)] leading-relaxed max-w-md mx-auto lg:mx-0 mb-9">
            The simplest CRM for painters, electricians, cleaners and every trade business in the UK.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-4">
            <Link href="/signup" className="w-full sm:w-auto text-center text-[15px] font-semibold text-white px-7 py-3.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:brightness-110 transition-all">
              Start free — no card needed →
            </Link>
            <Link href="/login" className="w-full sm:w-auto text-center text-sm text-[color:var(--t2)] hover:text-white px-5 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
              Sign in
            </Link>
          </div>
          <p className="text-xs text-[color:var(--t3)]">Set up your account in under 2 minutes</p>
        </div>

        <div className="relative mx-auto w-full max-w-[380px] lg:max-w-none h-[420px] sm:h-[460px]">
          <div className="absolute inset-0 m-auto w-[280px] sm:w-[300px] h-[360px] rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.5)] rotate-[-4deg] p-5 text-[#111]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
              <span className="text-[11px] font-bold tracking-wide text-gray-400">INVOICE</span>
            </div>
            <div className="text-[10px] text-gray-400 mb-0.5" style={{ fontFamily: 'ui-monospace,monospace' }}>INV-0248</div>
            <div className="text-[10px] text-gray-400 mb-4" style={{ fontFamily: 'ui-monospace,monospace' }}>04 Jul 2026</div>

            <div className="text-[11px] text-gray-400 mb-1">Bill to</div>
            <div className="text-[13px] font-semibold mb-4">Riverside Decorating Ltd</div>

            <div className="space-y-2 pb-3 mb-3 border-b border-gray-100">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-600">Living room · 2 coats</span>
                <span style={{ fontFamily: 'ui-monospace,monospace' }}>£480.00</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-600">Hallway ceiling &amp; walls</span>
                <span style={{ fontFamily: 'ui-monospace,monospace' }}>£210.00</span>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>VAT (20%)</span>
              <span style={{ fontFamily: 'ui-monospace,monospace' }}>£138.00</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[12px] font-bold">Total</span>
              <span className="text-[15px] font-extrabold bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-transparent" style={{ fontFamily: 'ui-monospace,monospace' }}>
                £828.00
              </span>
            </div>
          </div>

          <div className="hidden sm:flex absolute top-4 left-0 items-center gap-2 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-lg animate-float">
            <span className="text-base">👁️</span>
            <span className="text-xs font-medium text-gray-200">Live preview</span>
          </div>
          <div className="hidden sm:flex absolute top-10 right-0 items-center gap-2 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-lg animate-float [animation-delay:1.2s]">
            <span className="text-base">📄</span>
            <span className="text-xs font-medium text-gray-200">PDF export</span>
          </div>
          <div className="hidden sm:flex absolute bottom-16 left-2 items-center gap-2 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-lg animate-float [animation-delay:2.1s]">
            <span className="text-base">💬</span>
            <span className="text-xs font-medium text-gray-200">WhatsApp share</span>
          </div>
          <div className="hidden sm:flex absolute bottom-6 right-2 items-center gap-2 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-lg animate-float [animation-delay:0.6s]">
            <span className="text-base">🛡️</span>
            <span className="text-xs font-medium text-gray-200">No signup fee</span>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 sm:pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(([n, l]) => (
            <div key={l} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-5 text-center">
              <div className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-br from-indigo-300 to-indigo-500 bg-clip-text text-transparent">{n}</div>
              <div className="text-xs text-[color:var(--t2)] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 sm:pb-24">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Everything you need</h2>
          <p className="text-[color:var(--t2)] text-[15px]">No complexity. No subscriptions. Just the tools that matter.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(([icon, title, desc]) => (
            <FeatureCard key={title} icon={icon} title={title} desc={desc} />
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-20 sm:pb-24 text-center">
        <p className="text-[11px] text-[color:var(--t3)] tracking-[0.1em] uppercase mb-5">Perfect for</p>
        <div className="flex flex-wrap justify-center gap-2">
          {TRADES.map(t => (
            <span key={t} className="bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3.5 py-1.5 text-[13px] text-indigo-300">{t}</span>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-24 sm:pb-28 text-center">
        <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/[0.08] border border-indigo-500/20 rounded-3xl px-6 py-14 sm:px-10 sm:py-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Ready to get paid faster?</h2>
          <p className="text-[color:var(--t2)] text-[15px] mb-9">Join service businesses already using Sypho CRM.</p>
          <Link href="/signup" className="inline-block text-[15px] font-semibold text-white px-9 py-3.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:brightness-110 transition-all">
            Create your free account →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-7 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <LogoWhite size="sm" />
          <p className="text-xs text-[color:var(--t3)] order-3 sm:order-2">© 2026 Sypho CRM · Built for UK service businesses</p>
          <div className="flex gap-5 order-2 sm:order-3">
            <Link href="/login" className="text-xs text-[color:var(--t3)] hover:text-[color:var(--t2)]">Sign in</Link>
            <Link href="/signup" className="text-xs text-[color:var(--t3)] hover:text-[color:var(--t2)]">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
