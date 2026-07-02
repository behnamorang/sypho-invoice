interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  dark?: boolean
}

export default function Logo({ size = 'md', dark = false }: LogoProps) {
  const scales = { sm: 0.7, md: 1, lg: 1.4 }
  const s = scales[size]
  const w = Math.round(110 * s)
  const h = Math.round(32 * s)

  return (
    <svg width={w} height={h} viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dot with gradient — indigo theme */}
      <defs>
        <radialGradient id="dot-grad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#818cf8"/>
          <stop offset="100%" stopColor="#4338ca"/>
        </radialGradient>
      </defs>
      <circle cx="11" cy="16" r="11" fill="url(#dot-grad)"/>
      {/* sypho wordmark */}
      <text
        x="26" y="22.5"
        fontFamily="'Syne', 'DM Sans', system-ui, sans-serif"
        fontWeight="700"
        fontSize="18"
        letterSpacing="-0.3"
        fill={dark ? '#ffffff' : '#0a0a0f'}
      >
        sypho
      </text>
    </svg>
  )
}

export function LogoWhite({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <Logo size={size} dark={true} />
}
