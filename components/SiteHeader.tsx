'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { LogoWhite } from '@/components/Logo'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="max-w-6xl mx-auto px-6 py-5 relative">
      <div className="flex items-center justify-between">
        <Link href="/"><LogoWhite size="md" /></Link>

        <div className="hidden sm:flex items-center gap-2">
          <Link href="/pricing" className="text-sm text-[color:var(--t2)] hover:text-white transition-colors px-3 py-2">Pricing</Link>
          <Link href="/login" className="text-sm text-[color:var(--t2)] hover:text-white transition-colors px-3 py-2">Sign in</Link>
          <Link href="/signup" className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 hover:brightness-110 transition-all">
            Get started free
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="sm:hidden p-2 text-[color:var(--t2)]" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden absolute left-6 right-6 top-full mt-2 rounded-2xl border border-white/10 overflow-hidden z-50"
          style={{ background: '#111118' }}>
          <Link href="/pricing" onClick={() => setOpen(false)} className="block px-5 py-3.5 text-sm text-[color:var(--t2)] border-b border-white/5">Pricing</Link>
          <Link href="/login" onClick={() => setOpen(false)} className="block px-5 py-3.5 text-sm text-[color:var(--t2)] border-b border-white/5">Sign in</Link>
          <Link href="/signup" onClick={() => setOpen(false)} className="block px-5 py-3.5 text-sm font-semibold text-white bg-gradient-to-br from-indigo-500 to-violet-500">Get started free</Link>
        </div>
      )}
    </nav>
  )
}
