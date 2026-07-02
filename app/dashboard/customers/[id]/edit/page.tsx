import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CustomerForm from '@/components/CustomerForm'
export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createClient()
  const { data: customer } = await sb.from('customers').select('*').eq('id', id).single()
  if (!customer) notFound()
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{color:'var(--t1)'}}>Edit Customer</h1>
        <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>{customer.type==='company'?customer.company_name:customer.name}</p>
      </div>
      <CustomerForm customer={customer}/>
    </div>
  )
}
