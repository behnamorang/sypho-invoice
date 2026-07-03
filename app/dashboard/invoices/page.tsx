import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { STATUS_STYLES, computeStatus, currencySymbol } from '@/lib/types'
import { HoverLink } from '@/components/HoverHighlight'

export default async function InvoicesPage() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  const { data: invoices } = await sb.from('invoices').select('*,customer:customers(name,company_name,type)').eq('user_id', user!.id).eq('type', 'invoice').order('created_at', { ascending: false })
  const cn = (c: any) => c?.type==='company'?(c.company_name||c.name):c?.name||'—'

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{color:'var(--t1)'}}>Invoices</h1>
          <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>{invoices?.length||0} total</p>
        </div>
        <Link href="/dashboard/invoices/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
          <Plus size={15}/>New Invoice
        </Link>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{background:'var(--bg2)',borderColor:'var(--border)'}}>
        {!invoices?.length ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'var(--accent-s)'}}>
              <FileText size={24} style={{color:'var(--accent)'}}/>
            </div>
            <p className="font-medium mb-1" style={{color:'var(--t1)'}}>No invoices yet</p>
            <p className="text-sm mb-4" style={{color:'var(--t3)'}}>Create your first invoice</p>
            <Link href="/dashboard/invoices/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <Plus size={14}/>New Invoice
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-12 px-5 py-3 text-xs font-semibold uppercase" style={{color:'var(--t3)',borderBottom:'1px solid var(--border)',background:'var(--bg3)'}}>
              <span className="col-span-2">Invoice #</span><span className="col-span-3">Customer</span>
              <span className="col-span-2">Date</span><span className="col-span-2">Due</span>
              <span className="col-span-1">Status</span><span className="col-span-2 text-right">Total</span>
            </div>
            <div>
              {invoices.map(inv => {
                const status = computeStatus(inv)
                const ss = STATUS_STYLES[status]||STATUS_STYLES.draft
                const sym = currencySymbol(inv.currency||'GBP')
                const isOverdue = status==='overdue'
                return (
                  <HoverLink key={inv.id} href={`/dashboard/invoices/${inv.id}`}
                    className="flex flex-col md:grid md:grid-cols-12 px-5 py-3.5 gap-1 md:gap-0 md:items-center transition-all"
                    style={{borderBottom:'1px solid var(--border2)'}}
                    hoverStyle={{ background: 'var(--bg3)' }}>
                    <span className="col-span-2 text-sm font-semibold" style={{color:'var(--accent-t)'}}>#{inv.invoice_number}</span>
                    <span className="col-span-3 text-sm" style={{color:'var(--t1)'}}>{cn(inv.customer)}</span>
                    <span className="col-span-2 text-sm" style={{color:'var(--t3)'}}>{new Date(inv.issue_date).toLocaleDateString('en-GB')}</span>
                    <span className="col-span-2 text-sm" style={{color:isOverdue?'var(--err)':'var(--t3)'}}>
                      {inv.due_date?new Date(inv.due_date).toLocaleDateString('en-GB'):'—'}
                    </span>
                    <span className="col-span-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit" style={{background:'var(--bg4)',color:ss.text.includes('emerald')?'var(--ok)':ss.text.includes('red')?'var(--err)':ss.text.includes('amber')?'var(--warn)':'var(--t2)'}}>{ss.label}</span>
                    <span className="col-span-2 text-sm font-semibold md:text-right" style={{color:'var(--t1)'}}>{sym}{(inv.total||0).toFixed(2)}</span>
                  </HoverLink>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
