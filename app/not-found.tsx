import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:'var(--bg)'}}>
      <div className="text-center">
        <div className="font-display text-8xl font-bold mb-4" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>404</div>
        <h1 className="text-xl font-semibold mb-2" style={{color:'var(--t1)'}}>Page not found</h1>
        <p className="text-sm mb-8" style={{color:'var(--t3)'}}>The page you're looking for doesn't exist.</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
