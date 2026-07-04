import { createClient } from '@/lib/supabase/server'
import { currencySymbol, STATUS_STYLES } from '@/lib/types'
import DownloadInvoicePdf from '@/components/DownloadInvoicePdf'

export default async function SharedInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const sb = await createClient()
  const { data } = await sb.rpc('get_shared_invoice', { p_token: token })

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-white mb-2">Invoice not found</h1>
          <p className="text-sm text-gray-500">This link may be incorrect or the invoice may have been removed.</p>
        </div>
      </div>
    )
  }

  const shared = data as any
  const inv = shared.invoice
  const cust = shared.customer
  const biz = shared.business
  const items = shared.items || []
  const isQuote = inv.type === 'quotation'
  const sym = currencySymbol(inv.currency || 'GBP')
  const balance = inv.total - (inv.amount_paid || 0)
  const ss = STATUS_STYLES[inv.status] || STATUS_STYLES.draft
  const custName = cust?.type === 'company' ? (cust.company_name || cust.name) : cust?.name || 'Customer'

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.4)] p-8 sm:p-10 text-[#111]">
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {biz?.logo_url ? (
                <img src={biz.logo_url} alt={biz.name} className="h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
              )}
              <div>
                <div className="text-base font-bold">{biz?.name || 'Sypho CRM'}</div>
                {biz?.address && <div className="text-xs text-gray-400">{[biz.address, biz.city].filter(Boolean).join(', ')}</div>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold uppercase" style={{ color: biz?.invoice_color || '#2563eb' }}>
                {isQuote ? 'Quotation' : 'Invoice'}
              </div>
              <div className="text-xs text-gray-400 mt-1">#{inv.invoice_number}</div>
              <span className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${ss.bg} ${ss.text}`}>{ss.label}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-6 mb-8">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Bill to</div>
              <div className="text-sm font-semibold">{custName}</div>
              {cust?.address && <div className="text-xs text-gray-400 mt-0.5">{[cust.address, cust.city, cust.postcode].filter(Boolean).join(', ')}</div>}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date issued</div>
              <div className="text-sm text-gray-700">{new Date(inv.issue_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              {inv.due_date && !isQuote && (
                <>
                  <div className="text-xs text-gray-400 uppercase tracking-wide mt-3 mb-1">Due date</div>
                  <div className="text-sm text-gray-700">{new Date(inv.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-gray-100 mb-6">
            <div className="grid grid-cols-[1fr_50px_90px_90px] bg-gray-50 text-gray-500 text-xs font-semibold uppercase px-4 py-2.5">
              <span>Description</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Price</span>
              <span className="text-right">Amount</span>
            </div>
            {items.map((it: any, i: number) => (
              <div key={i} className="grid grid-cols-[1fr_50px_90px_90px] text-sm px-4 py-3 border-t border-gray-100">
                <span className="text-gray-700">{it.description}</span>
                <span className="text-center text-gray-500">{it.quantity}</span>
                <span className="text-right text-gray-600">{sym}{Number(it.unit_price).toFixed(2)}</span>
                <span className="text-right font-medium text-gray-800">{sym}{(it.quantity * it.unit_price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="ml-auto w-full sm:w-64 mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-1.5">
              <span>Subtotal</span>
              <span>{sym}{Number(inv.subtotal).toFixed(2)}</span>
            </div>
            {inv.vat_amount > 0 && (
              <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                <span>VAT</span>
                <span>{sym}{Number(inv.vat_amount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center rounded-lg px-4 py-3 mt-2" style={{ background: biz?.invoice_color ? `${biz.invoice_color}14` : '#eff6ff' }}>
              <span className="text-sm font-bold" style={{ color: biz?.invoice_color || '#2563eb' }}>Total</span>
              <span className="text-lg font-extrabold" style={{ color: biz?.invoice_color || '#2563eb' }}>{sym}{Number(inv.total).toFixed(2)}</span>
            </div>
            {inv.amount_paid > 0 && !isQuote && (
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Balance due</span>
                <span className="font-semibold text-gray-800">{sym}{balance.toFixed(2)}</span>
              </div>
            )}
          </div>

          {inv.payment_terms && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Payment terms</div>
              <div className="text-sm text-gray-600">{inv.payment_terms}</div>
            </div>
          )}
          {inv.notes && (
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Notes</div>
              <div className="text-sm text-gray-600 whitespace-pre-line">{inv.notes}</div>
            </div>
          )}

          {biz?.signature_url && (
            <div className="mb-6">
              <img src={biz.signature_url} alt="Signature" className="h-12 object-contain mb-1" />
              <div className="text-xs text-gray-400 border-t border-gray-200 pt-1 w-40">Authorised signature</div>
            </div>
          )}

          <div className="flex justify-center pt-4 border-t border-gray-100">
            <DownloadInvoicePdf shared={shared} />
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Invoiced with <a href="https://sypho-invoice.vercel.app" className="text-indigo-400 hover:text-indigo-300">Sypho CRM</a>
        </p>
      </div>
    </div>
  )
}
