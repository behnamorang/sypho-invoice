import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/SettingsForm'
export default async function SettingsPage() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  const { data: biz } = await sb.from('business_settings').select('*').eq('user_id', user!.id).single()
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{color:'var(--t1)'}}>Business Settings</h1>
        <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>Your details appear on all invoices and quotations</p>
      </div>
      <SettingsForm settings={biz||null}/>
    </div>
  )
}
