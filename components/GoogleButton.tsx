'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function GoogleButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setError('')
    setLoading(true)
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="text-sm px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 mb-3">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-60 transition-all"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <svg width="16" height="16" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.9 5.3 29.7 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.8-.4-4.5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12.5 24 12.5c3.1 0 5.8 1.1 8 3l6-6C34.9 5.3 29.7 3 24 3 15.6 3 8.4 7.8 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 45c5.6 0 10.7-2.1 14.5-5.6l-6.7-5.7C29.6 35.6 26.9 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8.1l-6.7 5.2C8.3 40.1 15.6 45 24 45z"/>
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.7 5.7C41.9 36 44 30.5 44 24c0-1.4-.1-2.8-.4-3.5z"/>
        </svg>
        {loading ? 'Redirecting…' : 'Continue with Google'}
      </button>
    </div>
  )
}
