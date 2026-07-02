'use client'
import { LogoWhite } from '@/components/Logo'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await createClient().auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard` } })
    if (error) { setError(error.message); setLoading(false) }
    else { setDone(true); setTimeout(() => router.push('/dashboard'), 1500) }
  }

  if (done) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl" style={{background:'rgba(99,102,241,0.15)'}}>✓</div>
        <h2 className="text-xl font-bold text-white mb-2">Account created!</h2>
        <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');`}</style>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <LogoWhite size="md" />
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1" style={{fontFamily:'Syne,sans-serif'}}>Create your account</h1>
          <p className="text-sm text-gray-500">Free forever · No credit card needed</p>
        </div>
        <div className="rounded-2xl p-6 border border-white/10" style={{background:'rgba(255,255,255,0.04)'}}>
          <form onSubmit={handleSignup} className="space-y-4">
            {error && <div className="text-sm px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none text-white placeholder:text-gray-600"
                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                placeholder="you@example.com"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none text-white placeholder:text-gray-600"
                style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)'}}
                placeholder="Min. 6 characters"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',boxShadow:'0 4px 20px rgba(99,102,241,0.3)'}}>
              {loading ? 'Creating...' : 'Create free account'}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
