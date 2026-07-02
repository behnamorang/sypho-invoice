// Shared dark UI styles
export const card = "rounded-2xl border" 
export const cardStyle = { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }
export const cardHover = { background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(99,102,241,0.3)' }
export const inp = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all placeholder:text-gray-600"
export const inpStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0f0f5' }
export const inpFocus = { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' }
export const btnPrimary = "px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
export const btnPrimaryStyle = { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.25)' }
export const btnSecondary = "px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
export const btnSecondaryStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }
export const label = "block text-xs font-medium mb-1.5"
export const labelStyle = { color: 'rgba(255,255,255,0.5)' }
export const divider = { borderColor: 'rgba(255,255,255,0.07)' }
export const t1 = { color: '#f0f0f5' }
export const t2 = { color: 'rgba(255,255,255,0.6)' }
export const t3 = { color: 'rgba(255,255,255,0.3)' }
export const accent = { color: '#a5b4fc' }

export const STATUS: Record<string,{bg:string,text:string,label:string}> = {
  paid:           { bg:'rgba(16,185,129,0.15)',  text:'#6ee7b7', label:'Paid' },
  sent:           { bg:'rgba(99,102,241,0.15)',  text:'#a5b4fc', label:'Sent' },
  draft:          { bg:'rgba(255,255,255,0.08)', text:'rgba(255,255,255,0.4)', label:'Draft' },
  overdue:        { bg:'rgba(239,68,68,0.15)',   text:'#fca5a5', label:'Overdue' },
  partially_paid: { bg:'rgba(245,158,11,0.15)',  text:'#fcd34d', label:'Partial' },
  accepted:       { bg:'rgba(16,185,129,0.15)',  text:'#6ee7b7', label:'Accepted' },
  declined:       { bg:'rgba(239,68,68,0.15)',   text:'#fca5a5', label:'Declined' },
}
