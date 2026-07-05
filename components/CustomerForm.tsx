'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Customer } from '@/lib/types'
import Link from 'next/link'
import { inp, inpStyle, inpFocus, inpBlur, lbl, lblStyle } from './ui'

function Field({ label, value, onChange, type='text', placeholder='' }: { label:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string }) {
  return (
    <div>
      <label className={lbl} style={lblStyle}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        autoComplete="off" className={inp} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur}/>
    </div>
  )
}

export default function CustomerForm({ customer }: { customer?: Customer }) {
  const router = useRouter()
  const [type, setType] = useState<'individual'|'company'>(customer?.type||'individual')
  const [name, setName] = useState(customer?.name||'')
  const [companyName, setCompanyName] = useState(customer?.company_name||'')
  const [companyReg, setCompanyReg] = useState(customer?.company_reg||'')
  const [vatNumber, setVatNumber] = useState(customer?.vat_number||'')
  const [phone, setPhone] = useState(customer?.phone||'')
  const [email, setEmail] = useState(customer?.email||'')
  const [address, setAddress] = useState(customer?.address||'')
  const [city, setCity] = useState(customer?.city||'')
  const [postcode, setPostcode] = useState(customer?.postcode||'')
  const [country, setCountry] = useState(customer?.country||'')
  const [notes, setNotes] = useState(customer?.notes||'')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { setErr('Not authenticated'); setLoading(false); return }
    const payload = { type, name, company_name: type==='company'?companyName:null, company_reg: type==='company'?companyReg:null, vat_number: type==='company'?vatNumber:null, phone, email, address, city, postcode, country, notes, user_id: user.id }
    const { error } = customer ? await sb.from('customers').update(payload).eq('id', customer.id) : await sb.from('customers').insert(payload)
    if (error) { setErr(error.message); setLoading(false) }
    else { router.push('/dashboard/customers'); router.refresh() }
  }

  const sectionStyle = { background: 'var(--bg2)', border: '1px solid var(--border)' }

  return (
    <form onSubmit={submit} className="space-y-4">
      {err && <div className="text-sm px-3 py-2.5 rounded-xl" style={{ background: 'var(--err-bg)', color: 'var(--err)', border: '1px solid rgba(248,113,113,0.2)' }}>{err}</div>}

      <div className="p-1 rounded-xl flex gap-1" style={{ background: 'var(--bg3)' }}>
        {(['individual','company'] as const).map(t => (
          <button key={t} type="button" onClick={() => setType(t)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize"
            style={{ background: type===t ? 'var(--bg4)' : 'transparent', color: type===t ? 'var(--t1)' : 'var(--t3)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl p-5 space-y-4" style={sectionStyle}>
        {type==='company' && <>
          <Field label="Company Name *" value={companyName} onChange={setCompanyName} placeholder="Acme Ltd"/>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Company Reg No." value={companyReg} onChange={setCompanyReg} placeholder="12345678"/>
            <Field label="VAT Number" value={vatNumber} onChange={setVatNumber} placeholder="GB123456789"/>
          </div>
          <Field label="Contact Person *" value={name} onChange={setName} placeholder="John Smith"/>
        </>}
        {type==='individual' && <Field label="Full Name *" value={name} onChange={setName} placeholder="John Smith"/>}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" value={phone} onChange={setPhone} placeholder="+971 50 123 4567" type="tel"/>
          <Field label="Email" value={email} onChange={setEmail} placeholder="john@example.com" type="email"/>
        </div>
        <Field label="Address" value={address} onChange={setAddress} placeholder="Street address"/>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><Field label="City" value={city} onChange={setCity} placeholder="City"/></div>
          <Field label="Postcode" value={postcode} onChange={setPostcode} placeholder="Postal code"/>
        </div>
        <Field label="Country" value={country} onChange={setCountry}/>
        <div>
          <label className={lbl} style={lblStyle}>Notes</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Any notes..."
            className={inp + " resize-none"} style={inpStyle} onFocus={inpFocus} onBlur={inpBlur}/>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/dashboard/customers" className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)' }}>Cancel</Link>
        <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
          {loading ? 'Saving...' : (customer ? 'Save Changes' : 'Add Customer')}
        </button>
      </div>
    </form>
  )
}
