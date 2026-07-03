'use client'
import { LogoWhite } from '@/components/Logo'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else { router.push('/dashboard'); router.refresh() }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');`}</style>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <LogoWhite size="md" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1" style={{fontFamily:'Syne,sans-serif'}}>Welcome back</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>
        <div className="rounded-2xl p-6 border border-white/10" style={{background:'rgba(255,255,255,0.04)'}}>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="text-sm px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all text-white placeholder:text-gray-600"
                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                placeholder="you@example.com"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all text-white placeholder:text-gray-600"
                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                placeholder="••••••••"/>
              <Link href="/forgot-password" className="block text-xs text-indigo-400 hover:text-indigo-300 mt-1.5">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60 transition-all"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',boxShadow:'0 4px 20px rgba(99,102,241,0.3)'}}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          No account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
