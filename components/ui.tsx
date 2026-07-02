// Shared dark theme UI primitives
export const card = "rounded-xl border" 
export const cardStyle = { background: 'var(--bg2)', borderColor: 'var(--border)' }
export const inp = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all placeholder:opacity-40"
export const inpStyle = { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t1)' }
export const inpFocus = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = 'var(--accent)' }
export const inpBlur = (e: React.FocusEvent) => { (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }
export const lbl = "block text-xs font-medium mb-1.5" 
export const lblStyle = { color: 'var(--t2)' }
export const btnPrimary = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
export const btnPrimaryStyle = { background: 'linear-gradient(135deg, var(--accent), var(--accent2))', boxShadow: '0 4px 20px rgba(99,102,241,0.25)' }
export const btnSecondary = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
export const btnSecondaryStyle = { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--t2)' }
