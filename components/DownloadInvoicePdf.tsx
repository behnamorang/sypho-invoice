'use client'

import { Download } from 'lucide-react'
import { generatePDF } from '@/lib/pdf'

export default function DownloadInvoicePdf({ shared }: { shared: any }) {
  async function handleDownload() {
    const invoice = {
      id: shared.invoice.id,
      user_id: '',
      customer_id: '',
      type: shared.invoice.type,
      invoice_number: shared.invoice.invoice_number,
      status: shared.invoice.status,
      issue_date: shared.invoice.issue_date,
      due_date: shared.invoice.due_date,
      notes: shared.invoice.notes,
      subtotal: shared.invoice.subtotal,
      vat_rate: shared.invoice.vat_rate,
      vat_amount: shared.invoice.vat_amount,
      total: shared.invoice.total,
      amount_paid: shared.invoice.amount_paid,
      payment_terms: shared.invoice.payment_terms,
      converted_to_invoice: null,
      currency: shared.invoice.currency,
      created_at: '',
      customer: {
        id: '', user_id: '', type: shared.customer?.type || 'individual',
        name: shared.customer?.name || '', company_name: shared.customer?.company_name || null,
        company_reg: null, vat_number: shared.customer?.vat_number || null,
        contact_name: shared.customer?.contact_name || null, phone: null, email: null,
        address: shared.customer?.address || null, city: shared.customer?.city || null,
        postcode: shared.customer?.postcode || null, country: null, notes: null, created_at: '',
      },
      items: (shared.items || []).map((it: any, i: number) => ({
        id: String(i), invoice_id: shared.invoice.id, description: it.description,
        quantity: it.quantity, unit_price: it.unit_price, vat_rate: it.vat_rate || 0,
        total: it.quantity * it.unit_price,
      })),
    }
    const biz = {
      id: '', user_id: '', type: 'company' as const,
      name: shared.business?.name || 'Sypho CRM', email: shared.business?.email || null,
      phone: shared.business?.phone || null, website: shared.business?.website || null,
      address: shared.business?.address || null, city: shared.business?.city || null,
      postcode: shared.business?.postcode || null, country: null,
      company_reg: shared.business?.company_reg || null, vat_number: shared.business?.vat_number || null,
      logo_url: shared.business?.logo_url || null, signature_url: shared.business?.signature_url || null,
      payment_terms: null, bank_details: null,
      currency: shared.invoice.currency || 'GBP', invoice_color: shared.business?.invoice_color || '#2563eb',
    }
    await generatePDF(invoice as any, biz as any, false)
  }

  return (
    <button onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
      style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.25)' }}>
      <Download size={15} />Download PDF
    </button>
  )
}
