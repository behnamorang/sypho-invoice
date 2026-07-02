import { createClient } from '@/lib/supabase/server'
import InvoiceForm from '@/components/InvoiceForm'
export default async function NewQuotationPage() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  const [{ data: customers }, { data: biz }] = await Promise.all([
    sb.from('customers').select('id,name,company_name,type').eq('user_id', user!.id).order('name'),
    sb.from('business_settings').select('currency').eq('user_id', user!.id).single(),
  ])
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{color:'var(--t1)'}}>New Quotation</h1>
        <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>Send a price estimate to your customer</p>
      </div>
      <InvoiceForm customers={customers||[]} docType="quotation" defaultCurrency={biz?.currency||'GBP'}/>
    </div>
  )
}
