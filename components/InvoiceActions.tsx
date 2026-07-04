'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Trash2, ChevronDown, FileCheck, Pencil, PrinterCheck, MessageCircle, Copy, Check } from 'lucide-react'
import { generatePDF } from '@/lib/pdf'
import { createClient } from '@/lib/supabase/client'
import { Invoice, BusinessSettings, currencySymbol, STATUS_STYLES } from '@/lib/types'

export default function InvoiceActions({ invoice, biz }: { invoice: Invoice; biz: BusinessSettings | null }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [copied, setCopied] = useState(false)
  const [openingWhatsApp, setOpeningWhatsApp] = useState(false)
  const isQuote = invoice.type === 'quotation'
  const base = isQuote ? '/dashboard/quotations' : '/dashboard/invoices'
  const sym = currencySymbol(invoice.currency || 'GBP')

  async function handleDelete() {
    if (!confirm('Delete this document?')) return
    setDeleting(true)
    const sb = createClient()
    await sb.from('invoice_items').delete().eq('invoice_id', invoice.id)
    await sb.from('invoices').delete().eq('id', invoice.id)
    router.push(base); router.refresh()
  }

  async function handleStatus(s: string) {
    setStatusLoading(true); setShowStatus(false)
    await createClient().from('invoices').update({ status: s }).eq('id', invoice.id)
    router.refresh(); setStatusLoading(false)
  }

  async function convertToInvoice() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { count } = await sb.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('type', 'invoice')
    const num = `INV-${String((count || 0) + 1).padStart(4, '0')}`
    const { data: inv } = await sb.from('invoices').insert({
      user_id: user.id, customer_id: invoice.customer_id, type: 'invoice',
      invoice_number: num, status: 'draft', issue_date: new Date().toISOString().split('T')[0],
      subtotal: invoice.subtotal, vat_rate: invoice.vat_rate, vat_amount: invoice.vat_amount,
      total: invoice.total, payment_terms: invoice.payment_terms, notes: invoice.notes, currency: invoice.currency,
    }).select().single()
    if (!inv) return
    if (invoice.items?.length) {
      await sb.from('invoice_items').insert(invoice.items.map(i => ({
        invoice_id: inv.id, description: i.description, quantity: i.quantity,
        unit_price: i.unit_price, vat_rate: i.vat_rate, total: i.total,
      })))
    }
    await sb.from('invoices').update({ converted_to_invoice: inv.id }).eq('id', invoice.id)
    router.push(`/dashboard/invoices/${inv.id}?new=1`)
  }

  function normalizePhoneForWhatsApp(raw: string): string {
    let digits = raw.replace(/[^0-9+]/g, '')
    if (digits.startsWith('+')) digits = digits.slice(1)
    else if (digits.startsWith('00')) digits = digits.slice(2)
    else if (digits.startsWith('0')) digits = '44' + digits.slice(1) // assume UK local format
    return digits
  }

  function sendWhatsApp() {
    const cust = invoice.customer as any
    const phone = cust?.phone ? normalizePhoneForWhatsApp(cust.phone) : ''
    const bizName = biz?.name || 'Sypho CRM'
    const custName = cust?.type === 'company' ? (cust.company_name || cust.name) : (cust?.name || '')
    const docType = isQuote ? 'Quotation' : 'Invoice'
    const balance = invoice.total - (invoice.amount_paid || 0)
    const link = invoice.share_token ? `${window.location.origin}/i/${invoice.share_token}` : null
    const lines = [
      `Hello ${custName},`, '',
      `Please find your *${docType} #${invoice.invoice_number}* from *${bizName}*.`, '',
      `• Amount: *${sym}${invoice.total.toFixed(2)}*`,
      invoice.amount_paid > 0 ? `• Paid: ${sym}${invoice.amount_paid.toFixed(2)}` : null,
      invoice.amount_paid > 0 ? `• Balance Due: *${sym}${balance.toFixed(2)}*` : null,
      invoice.due_date && !isQuote ? `• Due: *${new Date(invoice.due_date).toLocaleDateString('en-GB')}*` : null,
      invoice.payment_terms ? `• Terms: ${invoice.payment_terms}` : null,
      '',
      link ? `View and download it here: ${link}` : null,
      '', 'Thank you for your business! 🙏',
      biz?.phone ? `\nQueries: ${biz.phone}` : null,
    ].filter(Boolean).join('\n')
    const url = phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(lines)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(lines)}`
    setOpeningWhatsApp(true)
    setTimeout(() => { window.location.href = url }, 600)
  }

  async function copyLink() {
    if (!invoice.share_token) return
    const link = `${window.location.origin}/i/${invoice.share_token}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statuses = isQuote ? ['draft','sent','accepted','declined'] : ['draft','sent','paid','overdue','partially_paid']
  const btnStyle = { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)' }

  return (
    <>
    <div className="flex items-center gap-2 flex-wrap">
      {isQuote && !invoice.converted_to_invoice && invoice.status === 'accepted' && (
        <button onClick={convertToInvoice} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'var(--ok-bg)', color: 'var(--ok)', border: '1px solid rgba(52,211,153,0.25)' }}>
          <FileCheck size={14} />Convert to Invoice
        </button>
      )}

      <a href={`${base}/${invoice.id}/edit`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all" style={btnStyle}>
        <Pencil size={14} />Edit
      </a>

      <div className="relative">
        <button onClick={() => setShowStatus(!showStatus)} disabled={statusLoading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition-all" style={btnStyle}>
          {statusLoading ? '...' : 'Status'}<ChevronDown size={13} />
        </button>
        {showStatus && <>
          <div className="fixed inset-0 z-10" onClick={() => setShowStatus(false)} />
          <div className="absolute right-0 top-full mt-1 rounded-xl py-1 z-20 w-44 overflow-hidden"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}>
            {statuses.map(s => {
              const ss = STATUS_STYLES[s]
              return (
                <button key={s} onClick={() => handleStatus(s)}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-all"
                  style={{ color: invoice.status === s ? 'var(--accent-t)' : 'var(--t2)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg3)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                    background: s==='paid'||s==='accepted'?'var(--ok)':s==='overdue'||s==='declined'?'var(--err)':s==='partially_paid'?'var(--warn)':s==='sent'?'var(--accent)':'var(--t3)'
                  }}/>
                  {ss?.label || s}
                </button>
              )
            })}
          </div>
        </>}
      </div>

      <button onClick={copyLink} title="Copy the invoice link to share anywhere"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all" style={btnStyle}>
        {copied ? <Check size={14} style={{ color: 'var(--ok)' }} /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy link'}
      </button>

      <button onClick={sendWhatsApp} title="Sends a link to view this invoice online, not a file"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all"
        style={{ background: '#25d366' }}>
        <MessageCircle size={14} />WhatsApp
      </button>

      <button onClick={async () => { await generatePDF(invoice, biz, false) }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.25)' }}>
        <Download size={14} />PDF
      </button>

      <button onClick={async () => { await generatePDF(invoice, biz, true) }} title="PDF with status"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all" style={btnStyle}>
        <PrinterCheck size={14} />
      </button>

      <button onClick={handleDelete} disabled={deleting}
        className="p-2 rounded-xl transition-all disabled:opacity-50" style={btnStyle}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='var(--err-bg)'; el.style.color='var(--err)'; el.style.borderColor='rgba(248,113,113,0.3)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='var(--bg3)'; el.style.color='var(--t2)'; el.style.borderColor='var(--border)' }}>
        <Trash2 size={15} />
      </button>
    </div>
    {openingWhatsApp && (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl text-sm font-medium text-white z-50 flex items-center gap-2 shadow-lg" style={{ background: '#25d366' }}>
        <MessageCircle size={14} />Opening WhatsApp...
      </div>
    )}
    </>
  )
}
