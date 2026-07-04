import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import InvoiceActions from '@/components/InvoiceActions'
import PaymentTracker from '@/components/PaymentTracker'
import { STATUS_STYLES, computeStatus, currencySymbol } from '@/lib/types'

export default async function InvoiceDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> }) {
  const { id } = await params
  const { new: isNew } = await searchParams
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  const [{ data: invoice }, { data: items }, { data: biz }] = await Promise.all([
    sb.from('invoices').select('*,customer:customers(*)').eq('id', id).single(),
    sb.from('invoice_items').select('*').eq('invoice_id', id).order('created_at'),
    sb.from('business_settings').select('*').eq('user_id', user!.id).single(),
  ])
  if (!invoice) notFound()
  const inv = { ...invoice, items: items || [], customer: invoice.customer }
  const isQuote = invoice.type === 'quotation'
  const cust = invoice.customer as any
  const custName = cust?.type === 'company' ? (cust.company_name || cust.name) : cust?.name || '—'
  const sym = currencySymbol(invoice.currency || 'GBP')
  const displayStatus = computeStatus(invoice)
  const ss = STATUS_STYLES[displayStatus] || STATUS_STYLES.draft
  const amountPaid = invoice.amount_paid || 0
  const balance = invoice.total - amountPaid
  const dueDatePassed = invoice.due_date && new Date(invoice.due_date) < new Date() && invoice.status !== 'paid'

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-3xl mx-auto" style={{minHeight:'100vh'}}>
      {isNew && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{background:'var(--ok-bg)'}}>
          <CheckCircle size={18} style={{color:'var(--ok)',flexShrink:0}} />
          <p className="text-sm font-medium" style={{color:'var(--ok)'}}>{isQuote ? 'Quotation' : 'Invoice'} created successfully!</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href={isQuote ? '/dashboard/quotations' : '/dashboard/invoices'} className="p-2 rounded-lg transition-colors hover:bg-[var(--bg3)]" style={{border:'1px solid var(--border)',color:'var(--t3)'}}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold" style={{color:'var(--t1)'}}>#{invoice.invoice_number}</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${ss.bg} ${ss.text}`}>{ss.label}</span>
              {isQuote && <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700">Quotation</span>}
            </div>
            <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>{new Date(invoice.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <InvoiceActions invoice={inv} biz={biz || null} />
      </div>

      {!isQuote && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Invoice Total', value: `${sym}${invoice.total.toFixed(2)}`, color: 'var(--t1)' },
            { label: 'Amount Paid', value: `${sym}${amountPaid.toFixed(2)}`, color: 'var(--ok)' },
            { label: 'Balance Due', value: `${sym}${balance.toFixed(2)}`, color: balance > 0 ? 'var(--err)' : 'var(--ok)' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
              <p className="text-xs mb-1" style={{color:'var(--t3)'}}>{s.label}</p>
              <p className="text-lg font-bold" style={{color:s.color}}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Customer */}
      <div className="rounded-xl p-5 mb-4" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
        <p className="text-xs font-semibold uppercase mb-2" style={{color:'var(--t3)'}}>Billed To</p>
        <p className="font-semibold" style={{color:'var(--t1)'}}>{custName}</p>
        {cust?.type === 'company' && cust.contact_name && <p className="text-sm mt-0.5" style={{color:'var(--t2)'}}>Attn: {cust.contact_name}</p>}
        {cust?.vat_number && <p className="text-xs" style={{color:'var(--t3)'}}>VAT: {cust.vat_number}</p>}
        {cust?.phone && <p className="text-sm" style={{color:'var(--t2)'}}>{cust.phone}</p>}
        {cust?.address && <p className="text-sm" style={{color:'var(--t2)'}}>{cust.address}</p>}
        {(cust?.city || cust?.postcode) && <p className="text-sm" style={{color:'var(--t2)'}}>{[cust.city, cust.postcode].filter(Boolean).join(', ')}</p>}
        {invoice.due_date && !isQuote && (
          <p className="text-sm font-medium mt-2" style={{color: dueDatePassed ? 'var(--err)' : 'var(--warn)'}}>
            Due: {new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
      </div>

      {/* Items */}
      <div className="rounded-xl overflow-hidden mb-4" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
        <div className="hidden sm:grid sm:grid-cols-12 px-5 py-3 text-xs font-semibold uppercase" style={{color:'var(--t3)',background:'var(--bg3)',borderBottom:'1px solid var(--border)'}}>
          <span className="col-span-5">Description</span>
          <span className="col-span-2 text-center">Qty</span>
          <span className="col-span-2 text-right">Unit Price</span>
          <span className="col-span-1 text-center">VAT</span>
          <span className="col-span-2 text-right">Amount</span>
        </div>
        {(!items || items.length === 0) ? (
          <p className="text-sm px-5 py-4" style={{color:'var(--t3)'}}>No items.</p>
        ) : (
          <div>
            {items.map((item, i) => (
              <div key={item.id} className="grid grid-cols-2 sm:grid-cols-12 px-5 py-4 gap-1 sm:gap-0 sm:items-center"
                style={{borderBottom: i < items.length - 1 ? '1px solid var(--border2)' : 'none'}}>
                <span className="col-span-2 sm:col-span-5 text-sm font-medium" style={{color:'var(--t1)'}}>{item.description}</span>
                <span className="text-sm sm:col-span-2 sm:text-center" style={{color:'var(--t3)'}}>×{item.quantity}</span>
                <span className="text-sm sm:col-span-2 text-right" style={{color:'var(--t2)'}}>{sym}{item.unit_price.toFixed(2)}</span>
                <span className="text-xs sm:col-span-1 sm:text-center" style={{color:'var(--t3)'}}>{item.vat_rate || 0}%</span>
                <span className="text-sm font-bold text-right sm:col-span-2" style={{color:'var(--t1)'}}>{sym}{item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="px-5 py-4 space-y-2" style={{borderTop:'1px solid var(--border)',background:'var(--bg3)'}}>
          <div className="flex justify-end gap-8">
            <span className="text-sm" style={{color:'var(--t2)'}}>Subtotal</span>
            <span className="text-sm font-medium w-28 text-right" style={{color:'var(--t1)'}}>{sym}{invoice.subtotal?.toFixed(2)}</span>
          </div>
          {(invoice.vat_amount || 0) > 0 && (
            <div className="flex justify-end gap-8">
              <span className="text-sm" style={{color:'var(--t2)'}}>VAT</span>
              <span className="text-sm font-medium w-28 text-right" style={{color:'var(--t1)'}}>{sym}{invoice.vat_amount?.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-end gap-8 pt-2" style={{borderTop:'1px solid var(--border)'}}>
            <span className="text-sm font-bold" style={{color:'var(--t1)'}}>Total</span>
            <span className="text-xl font-bold w-28 text-right" style={{color:'var(--t1)'}}>{sym}{invoice.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Tracker */}
      {!isQuote && <PaymentTracker invoiceId={invoice.id} total={invoice.total} amountPaid={amountPaid} currency={invoice.currency || 'GBP'} />}

      {(invoice.payment_terms || invoice.notes) && (
        <div className="rounded-xl p-5 mt-4 space-y-3" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
          {invoice.payment_terms && <div><p className="text-xs font-semibold uppercase mb-1" style={{color:'var(--t3)'}}>Payment Terms</p><p className="text-sm" style={{color:'var(--t2)'}}>{invoice.payment_terms}</p></div>}
          {invoice.notes && <div><p className="text-xs font-semibold uppercase mb-1" style={{color:'var(--t3)'}}>Notes</p><p className="text-sm" style={{color:'var(--t2)'}}>{invoice.notes}</p></div>}
        </div>
      )}
    </div>
  )
}
