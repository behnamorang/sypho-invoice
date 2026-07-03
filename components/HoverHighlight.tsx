'use client'

import Link from 'next/link'
import { useState, type CSSProperties, type ReactNode } from 'react'

type HoverLinkProps = {
  href: string
  className?: string
  style?: CSSProperties
  hoverStyle?: CSSProperties
  children: ReactNode
}

export function HoverLink({ href, className, style, hoverStyle, children }: HoverLinkProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      className={className}
      style={{ ...style, ...(hovered && hoverStyle ? hoverStyle : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  )
}

type HoverRowProps = {
  className?: string
  style?: CSSProperties
  hoverStyle?: CSSProperties
  children: ReactNode
}

export function HoverRow({ className, style, hoverStyle, children }: HoverRowProps) {
  const [hovered, setHovered] = useState(false)
  const activeHover = hoverStyle ?? { background: 'var(--bg3)' }
  return (
    <div
      className={className}
      style={{
        ...style,
        ...(hovered ? activeHover : { background: 'transparent' }),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  )
}

type HoverCardProps = {
  href: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function HoverCard({ href, className, style, children }: HoverCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      className={className}
      style={{
        ...style,
        borderColor: hovered ? 'rgba(99,102,241,0.3)' : (style?.borderColor ?? 'var(--border)'),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  )
}
