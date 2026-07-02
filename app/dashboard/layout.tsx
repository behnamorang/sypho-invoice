import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <div className="flex h-screen overflow-hidden" style={{background:'#0a0a0f'}}>
      <Sidebar userEmail={user.email || ''} />
      <main className="flex-1 overflow-y-auto" style={{background:'#0a0a0f'}}>
        {children}
      </main>
    </div>
  )
}
