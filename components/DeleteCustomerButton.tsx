'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'
export default function DeleteCustomerButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [c, setC] = useState(false)
  const [loading, setLoading] = useState(false)
  async function del() { setLoading(true); await createClient().from('customers').delete().eq('id', id); router.refresh() }
  if (c) return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs hidden sm:inline" style={{color:'var(--t3)'}}>Delete?</span>
      <button onClick={del} disabled={loading} className="text-xs px-2 py-1 rounded-lg font-medium" style={{background:'var(--err-bg)',color:'var(--err)'}}>{loading?'...':'Yes'}</button>
      <button onClick={()=>setC(false)} className="text-xs px-2 py-1 rounded-lg font-medium" style={{border:'1px solid var(--border)',color:'var(--t2)'}}>No</button>
    </div>
  )
  return (
    <button onClick={()=>setC(true)} className="p-1.5 rounded-lg transition-all" style={{border:'1px solid var(--border)',color:'var(--t3)'}}
      onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='var(--err-bg)';el.style.color='var(--err)';el.style.borderColor='rgba(248,113,113,0.3)'}}
      onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='transparent';el.style.color='var(--t3)';el.style.borderColor='var(--border)'}}>
      <Trash2 size={13}/>
    </button>
  )
}
