const PALETTE = [
  { bg: 'rgba(99,102,241,0.15)', text: '#818cf8' },  // indigo
  { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa' },  // violet
  { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },  // blue
  { bg: 'rgba(20,184,166,0.15)', text: '#2dd4bf' },  // teal
  { bg: 'rgba(16,185,129,0.15)', text: '#34d399' },  // emerald
  { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' },  // amber
  { bg: 'rgba(244,63,94,0.15)', text: '#fb7185' },   // rose
  { bg: 'rgba(236,72,153,0.15)', text: '#f472b6' },  // pink
  { bg: 'rgba(6,182,212,0.15)', text: '#22d3ee' },   // cyan
  { bg: 'rgba(249,115,22,0.15)', text: '#fb923c' },  // orange
]

function colorForName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function initialsForName(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

const SIZES = {
  sm: { box: 'w-7 h-7', text: 'text-[10px]' },
  md: { box: 'w-9 h-9', text: 'text-xs' },
}

export default function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const color = colorForName(name || '?')
  const s = SIZES[size]
  return (
    <div
      className={`${s.box} rounded-xl flex items-center justify-center flex-shrink-0 font-semibold ${s.text}`}
      style={{ background: color.bg, color: color.text }}
    >
      {initialsForName(name || '?')}
    </div>
  )
}
