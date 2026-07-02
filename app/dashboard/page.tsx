import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, FileText, DollarSign, AlertCircle, Plus, ArrowRight, TrendingUp } from 'lucide-react'
import { STATUS_STYLES, computeStatus, currencySymbol } from '@/lib/types'

export default async function DashboardPage() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  const uid = user!.id
  const [{ count: cc }, { data: invs }] = await Promise.all([
    sb.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', uid),
    sb.from('invoices').select('*,customer:customers(name)').eq('user_id', uid).eq('type', 'invoice').order('created_at', { ascending: false }),
  ])
  const all = invs || []
  const revenue = all.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0)
  const outstanding = all.filter(i => ['sent','partially_paid','overdue'].includes(computeStatus(i))).reduce((s, i) => s + ((i.total||0)-(i.amount_paid||0)), 0)
  const overdueCount = all.filter(i => computeStatus(i) === 'overdue').length

  const stats = [
    { label: 'Customers', value: cc || 0, icon: Users, color: '#818cf8', bg: 'rgba(99,102,241,0.12)', href: '/dashboard/customers' },
    { label: 'Invoices', value: all.length, icon: FileText, color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', href: '/dashboard/invoices' },
    { label: 'Revenue', value: `£${revenue.toFixed(2)}`, icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.12)', href: '/dashboard/invoices' },
    { label: 'Overdue', value: overdueCount, icon: AlertCircle, color: overdueCount > 0 ? '#f87171' : 'var(--t3)', bg: overdueCount > 0 ? 'rgba(248,113,113,0.12)' : 'var(--bg3)', href: '/dashboard/invoices' },
  ]

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--t1)' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--t3)' }}>Your business at a glance</p>
        </div>
        <Link href="/dashboard/invoices/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.25)' }}>
          <Plus size={15} />New Invoice
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(s => (
          <Link key={s.label} href={s.href}
            className="p-4 rounded-xl border transition-all"
            style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium" style={{ color: 'var(--t3)' }}>{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={14} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: 'var(--t1)' }}>{s.value}</p>
          </Link>
        ))}
      </div>

      {outstanding > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-4"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={15} style={{ color: 'var(--warn)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--warn)' }}>
              Outstanding: <span className="font-bold">£{outstanding.toFixed(2)}</span>
            </p>
          </div>
          <Link href="/dashboard/invoices" className="text-xs font-medium" style={{ color: 'var(--warn)' }}>View →</Link>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--t1)' }}>Recent Invoices</span>
          <Link href="/dashboard/invoices" className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--accent-t)' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {all.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent-s)' }}>
              <FileText size={24} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="font-medium mb-1" style={{ color: 'var(--t1)' }}>No invoices yet</p>
            <p className="text-sm mb-4" style={{ color: 'var(--t3)' }}>Create your first invoice to get started</p>
            <Link href="/dashboard/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <Plus size={14} />Create Invoice
            </Link>
          </div>
        ) : (
          <div>
            {all.slice(0, 6).map(inv => {
              const status = computeStatus(inv)
              const ss = STATUS_STYLES[status] || STATUS_STYLES.draft
              const sym = currencySymbol(inv.currency || 'GBP')
              return (
                <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-all"
                  style={{ borderBottom: '1px solid var(--border2)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--t1)' }}>{(inv.customer as any)?.name || '—'}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--t3)' }}>#{inv.invoice_number} · {new Date(inv.issue_date).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: 'var(--bg4)', color: ss.text.includes('emerald') ? 'var(--ok)' : ss.text.includes('red') ? 'var(--err)' : ss.text.includes('amber') ? 'var(--warn)' : 'var(--t2)' }}>{ss.label}</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--t1)' }}>{sym}{(inv.total||0).toFixed(2)}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
