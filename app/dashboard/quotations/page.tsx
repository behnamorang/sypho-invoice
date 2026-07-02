import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, FileCheck } from 'lucide-react'
import { STATUS_STYLES } from '@/lib/types'

export default async function QuotationsPage() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  const { data: quotes } = await sb.from('invoices').select('*,customer:customers(name,company_name,type)').eq('user_id', user!.id).eq('type', 'quotation').order('created_at', { ascending: false })
  const cn = (c: any) => c?.type==='company'?(c.company_name||c.name):c?.name||'—'
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{color:'var(--t1)'}}>Quotations</h1>
          <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>{quotes?.length||0} total</p>
        </div>
        <Link href="/dashboard/quotations/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
          <Plus size={15}/>New Quotation
        </Link>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{background:'var(--bg2)',borderColor:'var(--border)'}}>
        {!quotes?.length ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'var(--accent-s)'}}>
              <FileCheck size={24} style={{color:'var(--accent)'}}/>
            </div>
            <p className="font-medium mb-1" style={{color:'var(--t1)'}}>No quotations yet</p>
            <p className="text-sm mb-4" style={{color:'var(--t3)'}}>Send your first quote to a customer</p>
            <Link href="/dashboard/quotations/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <Plus size={14}/>New Quotation
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-5 px-5 py-3 text-xs font-semibold uppercase" style={{color:'var(--t3)',borderBottom:'1px solid var(--border)',background:'var(--bg3)'}}>
              <span>Ref #</span><span>Customer</span><span>Date</span><span>Status</span><span className="text-right">Total</span>
            </div>
            <div>
              {quotes.map(q => {
                const ss = STATUS_STYLES[q.status]||STATUS_STYLES.draft
                return (
                  <Link key={q.id} href={`/dashboard/quotations/${q.id}`}
                    className="flex flex-col md:grid md:grid-cols-5 px-5 py-3.5 gap-1 md:gap-0 md:items-center transition-all"
                    style={{borderBottom:'1px solid var(--border2)'}}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='var(--bg3)'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                    <span className="text-sm font-semibold" style={{color:'var(--accent-t)'}}>#{q.invoice_number}</span>
                    <span className="text-sm" style={{color:'var(--t1)'}}>{cn(q.customer)}</span>
                    <span className="text-sm" style={{color:'var(--t3)'}}>{new Date(q.issue_date).toLocaleDateString('en-GB')}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium w-fit" style={{background:'var(--bg4)',color:ss.text.includes('emerald')?'var(--ok)':ss.text.includes('red')?'var(--err)':'var(--t2)'}}>{ss.label}</span>
                    <span className="text-sm font-semibold md:text-right" style={{color:'var(--t1)'}}>£{(q.total||0).toFixed(2)}</span>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
