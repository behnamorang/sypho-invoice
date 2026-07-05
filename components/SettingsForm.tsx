'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BusinessSettings, CURRENCIES } from '@/lib/types'

const inp = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all placeholder:opacity-40"
const inpSt: React.CSSProperties = { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)' }
const lbl = "block text-xs font-medium mb-1.5"
const lblSt: React.CSSProperties = { color: 'var(--t2)' }
const section = "rounded-xl p-5 space-y-4"
const sectionSt: React.CSSProperties = { background: 'var(--bg2)', border: '1px solid var(--border)' }

function Field({ label, value, onChange, type = 'text', placeholder = '', colSpan2 = false }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; colSpan2?: boolean
}) {
  return (
    <div className={colSpan2 ? 'col-span-2' : ''}>
      <label className={lbl} style={lblSt}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} autoComplete="off" className={inp} style={inpSt} />
    </div>
  )
}

function ImageUploadField({ label, description, preview, onFile }: {
  label: string; description: string; preview: string | null; onFile: (f: File) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div>
      <label className={lbl} style={lblSt}>{label}</label>
      <p className='text-xs mb-2' style={{color:'var(--t3)'}}>{description}</p>
      <div className="flex items-start gap-4">
        {preview ? (
          <div className='w-32 h-20 rounded-xl flex items-center justify-center overflow-hidden' style={{border:'1px solid var(--border)',background:'var(--bg3)'}}>
            <img src={preview} alt={label} className="max-w-full max-h-full object-contain" />
          </div>
        ) : (
          <div className='w-32 h-20 rounded-xl flex items-center justify-center text-xs' style={{border:'2px dashed var(--border)',background:'var(--bg3)',color:'var(--t3)'}}>No image</div>
        )}
        <button type="button" onClick={() => ref.current?.click()}
          className="px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[var(--bg3)]" style={{border:'1px solid var(--border)',color:'var(--t2)'}}>
          {preview ? 'Change' : 'Upload'}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
      </div>
    </div>
  )
}

export default function SettingsForm({ settings }: { settings: BusinessSettings | null }) {
  const [bizType, setBizType] = useState<'company' | 'freelancer'>(settings?.type || 'company')
  const [name, setName] = useState(settings?.name || '')
  const [email, setEmail] = useState(settings?.email || '')
  const [phone, setPhone] = useState(settings?.phone || '')
  const [website, setWebsite] = useState(settings?.website || '')
  const [address, setAddress] = useState(settings?.address || '')
  const [city, setCity] = useState(settings?.city || '')
  const [postcode, setPostcode] = useState(settings?.postcode || '')
  const [country, setCountry] = useState(settings?.country || '')
  const [companyReg, setCompanyReg] = useState(settings?.company_reg || '')
  const [vatNumber, setVatNumber] = useState(settings?.vat_number || '')
  const [paymentTerms, setPaymentTerms] = useState(settings?.payment_terms || 'Payment due within 30 days')
  const [bankDetails, setBankDetails] = useState(settings?.bank_details || '')
  const [currency, setCurrency] = useState(settings?.currency || 'GBP')
  const [invoiceColor, setInvoiceColor] = useState(settings?.invoice_color || '#2563eb')
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logo_url || null)
  const [sigPreview, setSigPreview] = useState<string | null>(settings?.signature_url || null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [sigFile, setSigFile] = useState<File | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  function handleLogo(f: File) {
    setLogoFile(f)
    const r = new FileReader(); r.onload = e => setLogoPreview(e.target?.result as string); r.readAsDataURL(f)
  }
  function handleSig(f: File) {
    setSigFile(f)
    const r = new FileReader(); r.onload = e => setSigPreview(e.target?.result as string); r.readAsDataURL(f)
  }

  async function uploadImage(sb: any, file: File, path: string): Promise<string | null> {
    const { error } = await sb.storage.from('sypho-assets').upload(path, file, { upsert: true })
    if (error) return null
    return sb.storage.from('sypho-assets').getPublicUrl(path).data.publicUrl
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { setErr('Not authenticated'); setLoading(false); return }

    let logo_url = settings?.logo_url || null
    let signature_url = settings?.signature_url || null
    if (logoFile) logo_url = await uploadImage(sb, logoFile, `logos/${user.id}.${logoFile.name.split('.').pop()}`) || logo_url
    if (sigFile) signature_url = await uploadImage(sb, sigFile, `signatures/${user.id}.${sigFile.name.split('.').pop()}`) || signature_url

    const payload = {
      type: bizType, name, email, phone, website, address, city, postcode, country,
      company_reg: companyReg, vat_number: vatNumber, payment_terms: paymentTerms,
      bank_details: bankDetails, currency, invoice_color: invoiceColor,
      logo_url, signature_url, user_id: user.id, updated_at: new Date().toISOString()
    }
    const { error } = settings
      ? await sb.from('business_settings').update(payload).eq('user_id', user.id)
      : await sb.from('business_settings').insert(payload)
    if (error) { setErr(error.message); setLoading(false) }
    else { setSaved(true); setLoading(false); setTimeout(() => setSaved(false), 3000) }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {err && <div className='text-sm px-3 py-2.5 rounded-xl' style={{background:'var(--err-bg)',color:'var(--err)'}}>{err}</div>}
      {saved && <div className='text-sm px-3 py-2.5 rounded-xl' style={{background:'var(--ok-bg)',color:'var(--ok)'}}>✓ Settings saved successfully</div>}

      <div className='p-1 rounded-xl flex gap-1' style={{background:'var(--bg3)'}}>
        {(['company', 'freelancer'] as const).map(t => (
          <button key={t} type="button" onClick={() => setBizType(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${bizType === t ? 'bg-white text-gray-900 shadow-sm' : ''}`}
            style={bizType === t ? undefined : { color: 'var(--t3)' }}>
            {t === 'company' ? 'Company' : 'Freelancer / Individual'}
          </button>
        ))}
      </div>

      <div className={section} style={sectionSt}>
        <h3 className="text-sm font-semibold" style={{color:'var(--t1)'}}>{bizType === 'company' ? 'Company Details' : 'Personal Details'}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label={bizType === 'company' ? 'Company Name *' : 'Full Name *'} value={name} onChange={setName} placeholder={bizType === 'company' ? 'Acme Services Ltd' : 'John Smith'} colSpan2 /></div>
          {bizType === 'company' && <>
            <Field label="Company Reg No." value={companyReg} onChange={setCompanyReg} placeholder="12345678" />
            <Field label="VAT Number" value={vatNumber} onChange={setVatNumber} placeholder="GB123456789" />
          </>}
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="hello@company.com" />
          <Field label="Phone" value={phone} onChange={setPhone} placeholder="+971 50 123 4567" />
          <div className="col-span-2"><Field label="Website" value={website} onChange={setWebsite} placeholder="https://www.yourcompany.com" colSpan2 /></div>
        </div>
      </div>

      <div className={section} style={sectionSt}>
        <h3 className="text-sm font-semibold" style={{color:'var(--t1)'}}>Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Street Address" value={address} onChange={setAddress} placeholder="Street address" colSpan2 /></div>
          <Field label="City" value={city} onChange={setCity} placeholder="City" />
          <Field label="Postcode" value={postcode} onChange={setPostcode} placeholder="Postal code" />
          <div className="col-span-2">
            <label className={lbl} style={lblSt}>Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className={inp + " appearance-auto"} style={inpSt}>
              <option value="">Select country</option>
              {['United Kingdom','Oman','UAE','Saudi Arabia','Qatar','Bahrain','Kuwait','United States','Canada','Australia','Germany','France','Netherlands','Singapore'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={section} style={sectionSt}>
        <h3 className="text-sm font-semibold" style={{color:'var(--t1)'}}>Invoice Defaults</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl} style={lblSt}>Default Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className={inp + " appearance-auto"} style={inpSt}>
              {Object.entries(CURRENCIES).map(([code, { name: n, symbol }]) => <option key={code} value={code}>{symbol} — {n}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl} style={lblSt}>Invoice Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={invoiceColor} onChange={e => setInvoiceColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer p-0.5" style={{border:'1px solid var(--border)'}} />
              <input value={invoiceColor} onChange={e => setInvoiceColor(e.target.value)} className={inp} style={inpSt} placeholder="#2563eb" />
            </div>
          </div>
        </div>
        <Field label="Default Payment Terms" value={paymentTerms} onChange={setPaymentTerms} />
        <div>
          <label className={lbl} style={lblSt}>Bank Details / Payment Instructions</label>
          <textarea value={bankDetails} onChange={e => setBankDetails(e.target.value)} rows={2}
            placeholder="Sort: 00-00-00, Account: 12345678" className={inp + " resize-none"} style={inpSt} />
        </div>
      </div>

      <div className={section} style={sectionSt}>
        <h3 className="text-sm font-semibold" style={{color:'var(--t1)'}}>Branding</h3>
        <ImageUploadField label="Company Logo" description="Appears at the top of every invoice and quotation PDF." preview={logoPreview} onFile={handleLogo} />
        <div style={{borderTop:'1px solid var(--border2)', paddingTop: '1rem'}}>
          <ImageUploadField label="Signature / Stamp" description="Printed in colour at the bottom of every PDF." preview={sigPreview} onFile={handleSig} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}
