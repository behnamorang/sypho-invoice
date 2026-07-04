'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Invoice, InvoiceItem, CURRENCIES, currencySymbol } from '@/lib/types'

interface Item { id: string; description: string; quantity: number; unit_price: number; vat_rate: number }
interface Props {
  customers: { id: string; name: string; company_name: string | null; type: string }[]
  docType?: 'invoice' | 'quotation'
  defaultCurrency?: string
  editInvoice?: Invoice & { items?: InvoiceItem[] }
}

const inp = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all placeholder:opacity-40"
const IS: React.CSSProperties = { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)' }
const lbl = "block text-xs font-medium mb-1.5"
const LS: React.CSSProperties = { color: 'var(--t2)' }

export default function InvoiceForm({ customers, docType = 'invoice', defaultCurrency = 'GBP', editInvoice }: Props) {
  const router = useRouter()
  const isEdit = !!editInvoice

  const [custId, setCustId] = useState(editInvoice?.customer_id || '')
  const [status, setStatus] = useState<string>(editInvoice?.status || 'draft')
  const [issueDate, setIssueDate] = useState(editInvoice?.issue_date || new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(editInvoice?.due_date || '')
  const [payTerms, setPayTerms] = useState(editInvoice?.payment_terms || 'Payment due within 30 days')
  const [notes, setNotes] = useState(editInvoice?.notes || '')
  const [currency, setCurrency] = useState(editInvoice?.currency || defaultCurrency)
  const [items, setItems] = useState<Item[]>(
    editInvoice?.items?.length
      ? editInvoice.items.map(i => ({ id: i.id, description: i.description, quantity: i.quantity, unit_price: i.unit_price, vat_rate: i.vat_rate || 0 }))
      : [{ id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0, vat_rate: 0 }]
  )
  const [globalVat, setGlobalVat] = useState(editInvoice?.vat_rate || 0)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const addItem = () => setItems(p => [...p, { id: crypto.randomUUID(), description: '', quantity: 1, unit_price: 0, vat_rate: globalVat }])
  const removeItem = (id: string) => { if (items.length > 1) setItems(p => p.filter(i => i.id !== id)) }
  const updItem = (id: string, k: keyof Item, v: string | number) => setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i))
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0)
  const vatAmt = items.reduce((s, i) => s + (i.quantity * i.unit_price * (i.vat_rate / 100)), 0)
  const total = subtotal + vatAmt
  const sym = currencySymbol(currency)
  const cn = (c: { name: string; company_name: string | null; type: string }) => c.type === 'company' ? (c.company_name || c.name) : c.name

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); if (!custId) { setErr('Select a customer'); return }
    setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { setErr('Not authenticated'); setLoading(false); return }

    const payload = {
      customer_id: custId, status, issue_date: issueDate, due_date: dueDate || null,
      notes: notes || null, subtotal, vat_amount: vatAmt, total, vat_rate: globalVat,
      payment_terms: payTerms || null, currency,
    }

    if (isEdit) {
      const { error: ue } = await sb.from('invoices').update(payload).eq('id', editInvoice.id)
      if (ue) { setErr(ue.message); setLoading(false); return }
      await sb.from('invoice_items').delete().eq('invoice_id', editInvoice.id)
      const lineItems = items.filter(i => i.description.trim()).map(i => ({
        invoice_id: editInvoice.id, description: i.description, quantity: i.quantity,
        unit_price: i.unit_price, vat_rate: i.vat_rate, total: i.quantity * i.unit_price * (1 + i.vat_rate / 100),
      }))
      if (lineItems.length > 0) await sb.from('invoice_items').insert(lineItems)
      router.push(`/dashboard/${docType === 'invoice' ? 'invoices' : 'quotations'}/${editInvoice.id}`)
      router.refresh()
      return
    }

    const { count } = await sb.from('invoices').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('type', docType)
    const num = `${docType === 'invoice' ? 'INV' : 'QUO'}-${String((count || 0) + 1).padStart(4, '0')}`
    const { data: inv, error: ie } = await sb.from('invoices').insert({ ...payload, user_id: user.id, type: docType, invoice_number: num }).select().single()
    if (ie || !inv) { setErr(ie?.message || 'Failed'); setLoading(false); return }
    const lineItems = items.filter(i => i.description.trim()).map(i => ({
      invoice_id: inv.id, description: i.description, quantity: i.quantity,
      unit_price: i.unit_price, vat_rate: i.vat_rate, total: i.quantity * i.unit_price * (1 + i.vat_rate / 100),
    }))
    if (lineItems.length > 0) await sb.from('invoice_items').insert(lineItems)
    router.push(`/dashboard/${docType === 'invoice' ? 'invoices' : 'quotations'}/${inv.id}?new=1`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {err && <div className="text-sm px-3 py-2.5 rounded-lg bg-red-50 text-red-600">{err}</div>}

      <div className="rounded-xl p-5 space-y-4" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
        <h3 className="text-sm font-semibold" style={{color:'var(--t1)'}}>Details</h3>
        <div>
          <label className={lbl} style={LS}>Customer *</label>
          {customers.length === 0 ? (
            <div className="p-3 rounded-lg bg-amber-50 text-sm text-amber-700">
              No customers. <Link href="/dashboard/customers/new" className="underline font-medium">Add one first →</Link>
            </div>
          ) : (
            <select value={custId} onChange={e => setCustId(e.target.value)} required className={inp + " appearance-auto"} style={IS}>
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id} value={c.id}>{cn(c)}</option>)}
            </select>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={lbl} style={LS}>Issue Date</label><input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} required className={inp} style={IS} /></div>
          {docType === 'invoice' && <div><label className={lbl} style={LS}>Due Date</label><input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inp} style={IS} /></div>}
          <div>
            <label className={lbl} style={LS}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className={inp + " appearance-auto"} style={IS}>
              {docType === 'invoice'
                ? <><option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option></>
                : <><option value="draft">Draft</option><option value="sent">Sent</option><option value="accepted">Accepted</option><option value="declined">Declined</option></>}
            </select>
          </div>
          <div>
            <label className={lbl} style={LS}>Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className={inp + " appearance-auto"} style={IS}>
              {Object.entries(CURRENCIES).map(([code, { name, symbol }]) => (
                <option key={code} value={code}>{symbol} — {name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl} style={LS}>Default VAT</label>
            <select value={globalVat} onChange={e => { const v = Number(e.target.value); setGlobalVat(v); setItems(p => p.map(i => ({ ...i, vat_rate: v }))) }} className={inp + " appearance-auto"} style={IS}>
              <option value={0}>0%</option><option value={5}>5%</option><option value={20}>20%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="rounded-xl p-5" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
        <h3 className="text-sm font-semibold mb-4" style={{color:'var(--t1)'}}>Line Items</h3>
        <div className="hidden sm:grid sm:grid-cols-12 gap-2 mb-2 text-xs font-medium uppercase px-1" style={{color:'var(--t3)'}}>
          <span className="col-span-5">Description</span><span className="col-span-2 text-center">Qty</span>
          <span className="col-span-2 text-right">Price</span><span className="col-span-1 text-center">VAT</span>
          <span className="col-span-1 text-right">Total</span><span className="col-span-1" />
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <input value={item.description} onChange={e => updItem(item.id, 'description', e.target.value)} placeholder={`Service ${idx + 1}`} className={inp + " col-span-12 sm:col-span-5"} style={IS} />
              <input type="number" value={item.quantity} min={1} onChange={e => updItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))} className={inp + " col-span-4 sm:col-span-2 text-center"} style={IS} />
              <input type="number" value={item.unit_price} min={0} step={0.01} onChange={e => updItem(item.id, 'unit_price', Number(e.target.value))} className={inp + " col-span-5 sm:col-span-2 text-right"} style={IS} />
              <select value={item.vat_rate} onChange={e => updItem(item.id, 'vat_rate', Number(e.target.value))} className={inp + " col-span-2 sm:col-span-1 px-1 appearance-auto"} style={IS}>
                <option value={0}>0%</option><option value={5}>5%</option><option value={20}>20%</option>
              </select>
              <span className="hidden sm:block col-span-1 text-sm font-medium text-right" style={{color:'var(--t2)'}}>{sym}{(item.quantity * item.unit_price * (1 + item.vat_rate / 100)).toFixed(2)}</span>
              <button type="button" onClick={() => removeItem(item.id)} disabled={items.length === 1} className="col-span-1 p-2 flex justify-center disabled:opacity-30 transition-all" style={{color:'var(--t3)'}}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 mt-3"><Plus size={14} />Add item</button>
        <div className="mt-5 pt-4 space-y-2" style={{borderTop:'1px solid var(--border2)'}}>
          <div className="flex justify-end gap-8"><span className="text-sm" style={{color:'var(--t3)'}}>Subtotal</span><span className="text-sm font-medium w-28 text-right" style={{color:'var(--t1)'}}>{sym}{subtotal.toFixed(2)}</span></div>
          {vatAmt > 0 && <div className="flex justify-end gap-8"><span className="text-sm" style={{color:'var(--t3)'}}>VAT</span><span className="text-sm font-medium w-28 text-right" style={{color:'var(--t1)'}}>{sym}{vatAmt.toFixed(2)}</span></div>}
          <div className="flex justify-end gap-8 pt-2" style={{borderTop:'1px solid var(--border2)'}}>
            <span className="text-sm font-bold" style={{color:'var(--t1)'}}>Total</span>
            <span className="text-xl font-bold w-28 text-right" style={{color:'var(--t1)'}}>{sym}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5 space-y-4" style={{background:'var(--bg2)',border:'1px solid var(--border)'}}>
        {docType === 'invoice' && <div><label className={lbl} style={LS}>Payment Terms</label><input value={payTerms} onChange={e => setPayTerms(e.target.value)} className={inp} style={IS} /></div>}
        <div>
          <label className={lbl} style={LS}>Notes <span className="font-normal" style={{color:'var(--t3)'}}>/ Special instructions</span></label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="e.g. Bank transfer to Sort: 00-00-00, Acc: 12345678" className={inp + " resize-none"} style={IS} />
        </div>
      </div>

      <div className="flex gap-3">
        <Link href={`/dashboard/${docType === 'invoice' ? 'invoices' : 'quotations'}`} className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--bg3)]" style={{border:'1px solid var(--border)',color:'var(--t2)'}}>Cancel</Link>
        <button type="submit" disabled={loading || customers.length === 0} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
          {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : (docType === 'invoice' ? 'Create Invoice' : 'Create Quotation'))}
        </button>
      </div>
    </form>
  )
}
