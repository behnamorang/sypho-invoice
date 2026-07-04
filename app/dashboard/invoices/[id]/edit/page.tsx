import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import InvoiceForm from '@/components/InvoiceForm'

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  const [{ data: invoice }, { data: items }, { data: biz }, { data: customers }] = await Promise.all([
    sb.from('invoices').select('*').eq('id', id).single(),
    sb.from('invoice_items').select('*').eq('invoice_id', id).order('created_at'),
    sb.from('business_settings').select('currency').eq('user_id', user!.id).single(),
    sb.from('customers').select('id,name,company_name,type').eq('user_id', user!.id).order('name'),
  ])
  if (!invoice) notFound()
  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{color:'var(--t1)'}}>Edit Invoice</h1>
        <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>#{invoice.invoice_number}</p>
      </div>
      <InvoiceForm customers={customers || []} docType="invoice" defaultCurrency={biz?.currency || 'GBP'} editInvoice={{ ...invoice, items: items || [] }} />
    </div>
  )
}
