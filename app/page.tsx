'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{background:'#0a0a0f',color:'#f0f0f8',minHeight:'100vh',fontFamily:"'DM Sans',system-ui,sans-serif",overflowX:'hidden'}}>

      {/* Nav */}
      <nav style={{maxWidth:1100,margin:'0 auto',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <svg width="90" height="28" viewBox="0 0 90 28" fill="none">
            <defs>
              <radialGradient id="dg" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#818cf8"/>
                <stop offset="100%" stopColor="#4338ca"/>
              </radialGradient>
            </defs>
            <circle cx="10" cy="14" r="10" fill="url(#dg)"/>
            <text x="24" y="19" fontFamily="'Syne',sans-serif" fontWeight="700" fontSize="16" letterSpacing="-0.3" fill="#ffffff">sypho</text>
          </svg>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <Link href="/login" style={{color:'#9090a8',textDecoration:'none',fontSize:14,padding:'8px 16px'}}>Sign in</Link>
          <Link href="/signup" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',fontSize:14,fontWeight:600,padding:'9px 20px',borderRadius:10}}>Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:900,margin:'0 auto',padding:'60px 24px 80px',textAlign:'center'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.25)',borderRadius:100,padding:'6px 14px',marginBottom:32,fontSize:13,color:'#a5b4fc'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#818cf8',display:'inline-block'}}/>
          Built for UK service businesses
        </div>

        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:'clamp(42px,7vw,72px)',fontWeight:800,lineHeight:1.05,letterSpacing:'-1px',marginBottom:24}}>
          <span style={{background:'linear-gradient(135deg,#fff 0%,#a5b4fc 50%,#818cf8 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Invoices. Quotes.
          </span>
          <br/>
          <span style={{color:'#f0f0f8'}}>Customers. Done.</span>
        </h1>

        <p style={{fontSize:18,color:'#6b6b88',lineHeight:1.7,maxWidth:520,margin:'0 auto 40px'}}>
          The simplest CRM for painters, electricians, cleaners and every trade business in the UK.
        </p>

        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,flexWrap:'wrap',marginBottom:16}}>
          <Link href="/signup" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',fontSize:15,fontWeight:600,padding:'13px 28px',borderRadius:12,boxShadow:'0 8px 32px rgba(99,102,241,0.3)'}}>
            Start free — no card needed →
          </Link>
          <Link href="/login" style={{color:'#6b6b88',textDecoration:'none',fontSize:14,padding:'13px 20px',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12}}>
            Sign in
          </Link>
        </div>
        <p style={{fontSize:12,color:'#3a3a50'}}>Free forever · No credit card · Setup in 2 minutes</p>
      </section>

      {/* Stats */}
      <section style={{maxWidth:900,margin:'0 auto',padding:'0 24px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
          {[['2 min','Setup time'],['£0','Forever free'],['100%','UK compliant'],['6','Currencies']].map(([n,l])=>(
            <div key={l} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:16,padding:'20px 16px',textAlign:'center'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:700,background:'linear-gradient(135deg,#a5b4fc,#818cf8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{n}</div>
              <div style={{fontSize:12,color:'#55556a',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{maxWidth:900,margin:'0 auto',padding:'0 24px 80px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:700,marginBottom:12}}>Everything you need</h2>
          <p style={{color:'#55556a',fontSize:15}}>No complexity. No subscriptions. Just the tools that matter.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
          {[
            ['📄','Professional Invoices','UK-compliant invoices with VAT, company number, and custom branding. Export PDF in one click.'],
            ['💬','Send via WhatsApp','Share invoices directly to your customer\'s WhatsApp with a pre-written message.'],
            ['💳','Payment Tracking','Track paid, partially paid, and overdue invoices. Record payments instantly.'],
            ['📋','Quotations','Send professional quotes and convert accepted ones to invoices in one click.'],
            ['👥','Customer Manager','Store companies and individuals with full UK business details including VAT numbers.'],
            ['📊','Business Dashboard','See revenue, outstanding balance, and overdue invoices at a glance.'],
          ].map(([icon,title,desc])=>(
            <div key={title as string} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:24,transition:'all 0.2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(99,102,241,0.3)';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.05)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.03)'}}>
              <div style={{fontSize:28,marginBottom:12}}>{icon}</div>
              <h3 style={{fontSize:15,fontWeight:600,color:'#f0f0f8',marginBottom:8}}>{title}</h3>
              <p style={{fontSize:13,color:'#55556a',lineHeight:1.6}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trades */}
      <section style={{maxWidth:900,margin:'0 auto',padding:'0 24px 80px',textAlign:'center'}}>
        <p style={{fontSize:11,color:'#3a3a50',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:20}}>Perfect for</p>
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:8}}>
          {['Painters','Electricians','Plumbers','Cleaners','Builders','Gardeners','Decorators','Tilers','Plasterers','Handymen'].map(t=>(
            <span key={t} style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:100,padding:'6px 14px',fontSize:13,color:'#a5b4fc'}}>{t}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{maxWidth:700,margin:'0 auto',padding:'0 24px 100px',textAlign:'center'}}>
        <div style={{background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.08))',border:'1px solid rgba(99,102,241,0.2)',borderRadius:24,padding:'60px 40px'}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:36,fontWeight:700,marginBottom:12}}>Ready to get paid faster?</h2>
          <p style={{color:'#55556a',fontSize:15,marginBottom:36}}>Join service businesses already using Sypho CRM.</p>
          <Link href="/signup" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',textDecoration:'none',fontSize:15,fontWeight:600,padding:'14px 36px',borderRadius:12,boxShadow:'0 8px 32px rgba(99,102,241,0.3)',display:'inline-block'}}>
            Create your free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.06)',padding:'28px 24px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
          <svg width="80" height="24" viewBox="0 0 90 28" fill="none">
            <defs>
              <radialGradient id="dg2" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#818cf8"/>
                <stop offset="100%" stopColor="#4338ca"/>
              </radialGradient>
            </defs>
            <circle cx="10" cy="14" r="10" fill="url(#dg2)"/>
            <text x="24" y="19" fontFamily="'Syne',sans-serif" fontWeight="700" fontSize="16" fill="#ffffff">sypho</text>
          </svg>
          <p style={{fontSize:12,color:'#3a3a50'}}>© 2026 Sypho CRM · Built for UK service businesses</p>
          <div style={{display:'flex',gap:20}}>
            <Link href="/login" style={{color:'#3a3a50',textDecoration:'none',fontSize:12}}>Sign in</Link>
            <Link href="/signup" style={{color:'#3a3a50',textDecoration:'none',fontSize:12}}>Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
