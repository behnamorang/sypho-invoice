'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'partially_paid', label: 'Partial' },
  { value: 'overdue', label: 'Overdue' },
]

export default function StatusFilterSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('status') || ''

  function handleChange(v: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (v) params.set('status', v)
    else params.delete('status')
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      value={current}
      onChange={e => handleChange(e.target.value)}
      className="px-3 py-2.5 rounded-xl text-sm outline-none appearance-auto"
      style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)' }}
    >
      {OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
