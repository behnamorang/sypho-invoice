'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X, FileCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import Logo from '@/components/Logo'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/customers', label: 'Customers', icon: Users, exact: false },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText, exact: false },
  { href: '/dashboard/quotations', label: 'Quotations', icon: FileCheck, exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, exact: false },
]

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const isActive = (href: string, exact: boolean) => exact ? pathname === href : pathname.startsWith(href)

  async function signOut() {
    await createClient().auth.signOut()
    router.push('/login')
  }

  const NavContent = () => (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <Logo size="sm" dark />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? 'var(--accent-s)' : 'transparent',
                color: active ? 'var(--accent-t)' : 'var(--t2)',
              }}>
              <Icon size={15} style={{ color: active ? 'var(--accent)' : 'var(--t3)', flexShrink: 0 }} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + signout */}
      <div className="px-2 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="px-3 py-2 mb-1">
          <p className="text-xs truncate" style={{ color: 'var(--t3)' }}>{userEmail}</p>
        </div>
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all"
          style={{ color: 'var(--t2)' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--err-bg)'; el.style.color = 'var(--err)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--t2)' }}>
          <LogOut size={15} style={{ color: 'var(--t3)' }} />
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <Logo size="sm" dark />
        <button onClick={() => setOpen(!open)} style={{ color: 'var(--t2)' }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />}
      <div className={`md:hidden fixed top-0 left-0 h-full w-56 z-50 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </div>
      <div className="hidden md:flex w-56 flex-col flex-shrink-0">
        <NavContent />
      </div>
    </>
  )
}
