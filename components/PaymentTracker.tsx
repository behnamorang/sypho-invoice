'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { currencySymbol } from '@/lib/types'
import { PlusCircle } from 'lucide-react'

export default function PaymentTracker({ invoiceId, total, amountPaid, currency }: {
  invoiceId: string; total: number; amountPaid: number; currency: string
}) {
  const router = useRouter()
  const sym = currencySymbol(currency)
  const balance = total - amountPaid
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function recordPayment(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true)
    const paid = parseFloat(amount)
    if (!paid || paid <= 0) { setErr('Enter valid amount'); setLoading(false); return }
    const newPaid = Math.min(amountPaid + paid, total)
    const newStatus = newPaid >= total ? 'paid' : 'partially_paid'
    const { error } = await createClient().from('invoices').update({ amount_paid: newPaid, status: newStatus }).eq('id', invoiceId)
    if (error) { setErr(error.message); setLoading(false); return }
    setAmount(''); router.refresh(); setLoading(false)
  }

  if (balance <= 0) return (
    <div className="rounded-xl px-5 py-4 flex items-center gap-3" style={{ background: 'var(--ok-bg)', border: '1px solid rgba(52,211,153,0.2)' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(52,211,153,0.2)', color: 'var(--ok)' }}>✓</div>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--ok)' }}>Fully Paid</p>
        <p className="text-xs" style={{ color: 'var(--ok)', opacity: 0.7 }}>{sym}{total.toFixed(2)} received</p>
      </div>
    </div>
  )

  return (
    <div className="rounded-xl p-5" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--t1)' }}>Record Payment</h3>
      {err && <p className="text-xs mb-3" style={{ color: 'var(--err)' }}>{err}</p>}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'var(--bg3)' }}>
        {[
          { label: 'Total', value: `${sym}${total.toFixed(2)}`, color: 'var(--t1)' },
          { label: 'Paid', value: `${sym}${amountPaid.toFixed(2)}`, color: 'var(--ok)' },
          { label: 'Balance', value: `${sym}${balance.toFixed(2)}`, color: 'var(--err)' },
        ].map((s, i) => (
          <div key={s.label} className="flex-1 text-center">
            {i > 0 && <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-px h-6" style={{ background: 'var(--border)' }} />}
            <p className="text-xs mb-0.5" style={{ color: 'var(--t3)' }}>{s.label}</p>
            <p className="text-sm font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      <form onSubmit={recordPayment} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--t3)' }}>{sym}</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder={balance.toFixed(2)} min={0.01} max={balance} step={0.01}
            className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)' }}
            onFocus={e => (e.target as HTMLElement).style.borderColor = 'var(--accent)'}
            onBlur={e => (e.target as HTMLElement).style.borderColor = 'var(--border)'} />
        </div>
        <button type="button" onClick={() => setAmount(balance.toFixed(2))}
          className="px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap"
          style={{ border: '1px solid var(--border)', color: 'var(--t2)', background: 'var(--bg3)' }}>
          Full
        </button>
        <button type="submit" disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          <PlusCircle size={14} />{loading ? '...' : 'Record'}
        </button>
      </form>
    </div>
  )
}
