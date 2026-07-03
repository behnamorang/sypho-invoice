import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { STATUS_STYLES } from '@/lib/types'
import { HoverLink } from '@/components/HoverHighlight'

export default async function StatementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const [{ data: customer }, { data: invoices }] = await Promise.all([
    sb.from('customers').select('*').eq('id', id).single(),
    sb.from('invoices').select('*').eq('customer_id', id).eq('type', 'invoice').order('issue_date', { ascending: true }),
  ])
  if (!customer) notFound()
  const total = (invoices||[]).reduce((s,i)=>s+(i.total||0),0)
  const paid = (invoices||[]).filter(i=>i.status==='paid').reduce((s,i)=>s+(i.total||0),0)
  const outstanding = total - paid
  const custName = customer.type==='company'?(customer.company_name||customer.name):customer.name

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/customers" className="p-2 rounded-xl transition-all" style={{border:'1px solid var(--border)',color:'var(--t3)'}}>
          <ArrowLeft size={16}/>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold" style={{color:'var(--t1)'}}>Statement</h1>
          <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>{custName}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {label:'Total Invoiced',value:`£${total.toFixed(2)}`,color:'var(--t1)'},
          {label:'Total Paid',value:`£${paid.toFixed(2)}`,color:'var(--ok)'},
          {label:'Outstanding',value:`£${outstanding.toFixed(2)}`,color:outstanding>0?'var(--warn)':'var(--ok)'},
        ].map(s=>(
          <div key={s.label} className="rounded-xl p-4" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
            <p className="text-xs mb-1" style={{color:'var(--t3)'}}>{s.label}</p>
            <p className="text-xl font-bold font-display" style={{color:s.color}}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
        <div className="px-5 py-3 text-xs font-semibold uppercase" style={{color:'var(--t3)',borderBottom:'1px solid var(--border)',background:'var(--bg3)'}}>Invoice History</div>
        {!invoices?.length ? (
          <p className="text-sm px-5 py-8 text-center" style={{color:'var(--t3)'}}>No invoices for this customer</p>
        ) : (
          <div>
            {invoices.map(inv=>{
              const ss=STATUS_STYLES[inv.status]||STATUS_STYLES.draft
              return(
                <HoverLink key={inv.id} href={`/dashboard/invoices/${inv.id}`}
                  className="flex items-center justify-between px-5 py-3.5 transition-all"
                  style={{borderBottom:'1px solid var(--border2)'}}
                  hoverStyle={{ background: 'var(--bg3)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{color:'var(--t1)'}}>#{inv.invoice_number}</p>
                    <p className="text-xs mt-0.5" style={{color:'var(--t3)'}}>{new Date(inv.issue_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{background:'var(--bg4)',color:ss.text.includes('emerald')?'var(--ok)':ss.text.includes('red')?'var(--err)':'var(--t2)'}}>{ss.label}</span>
                    <span className="text-sm font-semibold w-20 text-right" style={{color:inv.status==='paid'?'var(--ok)':'var(--t1)'}}>£{(inv.total||0).toFixed(2)}</span>
                  </div>
                </HoverLink>
              )
            })}
            <div className="flex items-center justify-between px-5 py-4" style={{borderTop:'1px solid var(--border)',background:'var(--bg3)'}}>
              <span className="text-sm font-semibold" style={{color:'var(--t1)'}}>Balance Outstanding</span>
              <span className="text-lg font-bold font-display" style={{color:outstanding>0?'var(--warn)':'var(--ok)'}}>£{outstanding.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
