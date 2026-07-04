import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Users, FileText, SearchX } from 'lucide-react'
import Avatar from '@/components/Avatar'
import DeleteCustomerButton from '@/components/DeleteCustomerButton'
import { HoverRow } from '@/components/HoverHighlight'
import SearchBox from '@/components/SearchBox'

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  const { data: allCustomers } = await sb.from('customers').select('*').eq('user_id', user!.id).order('name')
  const query = (q || '').trim().toLowerCase()
  const customers = !query ? (allCustomers || []) : (allCustomers || []).filter(c => {
    const haystack = [c.name, c.company_name, c.phone, c.email].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(query)
  })
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{color:'var(--t1)'}}>Customers</h1>
          <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>{allCustomers?.length||0} total</p>
        </div>
        <Link href="/dashboard/customers/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
          <Plus size={15}/>Add Customer
        </Link>
      </div>
      {!!allCustomers?.length && (
        <div className="mb-4">
          <SearchBox placeholder="Search customers by name, company, phone or email..." />
        </div>
      )}
      <div className="rounded-xl border overflow-hidden" style={{background:'var(--bg2)',borderColor:'var(--border)'}}>
        {!allCustomers?.length ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'var(--accent-s)'}}>
              <Users size={24} style={{color:'var(--accent)'}}/>
            </div>
            <p className="font-medium mb-1" style={{color:'var(--t1)'}}>No customers yet</p>
            <p className="text-sm mb-4" style={{color:'var(--t3)'}}>Add your first customer to get started</p>
            <Link href="/dashboard/customers/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
              <Plus size={14}/>Add Customer
            </Link>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-14">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'var(--bg3)'}}>
              <SearchX size={22} style={{color:'var(--t3)'}}/>
            </div>
            <p className="font-medium mb-1" style={{color:'var(--t1)'}}>No customers match &quot;{q}&quot;</p>
            <p className="text-sm" style={{color:'var(--t3)'}}>Try a different name, company, phone or email</p>
          </div>
        ) : (
          <div>
            {customers.map(c => (
              <HoverRow key={c.id} className="flex items-center justify-between px-5 py-4 transition-all"
                style={{borderBottom:'1px solid var(--border2)'}}>
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={c.type==='company'?(c.company_name||c.name):c.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{color:'var(--t1)'}}>{c.type==='company'?c.company_name:c.name}</p>
                    <p className="text-xs truncate" style={{color:'var(--t3)'}}>{c.type==='company'?`Contact: ${c.name}`:c.phone||c.email||'No details'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="text-xs px-2 py-0.5 rounded-full hidden sm:inline capitalize" style={{background:'var(--bg4)',color:'var(--t3)'}}>{c.type}</span>
                  <Link href={`/dashboard/customers/${c.id}/statement`} className="p-1.5 rounded-lg hidden sm:flex items-center transition-all" style={{border:'1px solid var(--border)',color:'var(--t3)'}} title="Statement">
                    <FileText size={13}/>
                  </Link>
                  <Link href={`/dashboard/customers/${c.id}/edit`} className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all" style={{border:'1px solid var(--border)',color:'var(--t2)'}}>Edit</Link>
                  <DeleteCustomerButton id={c.id} name={c.type==='company'?c.company_name||c.name:c.name}/>
                </div>
              </HoverRow>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
