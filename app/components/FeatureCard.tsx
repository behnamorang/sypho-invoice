'use client'

import { useState } from 'react'

interface FeatureCardProps {
  icon: string
  title: string
  desc: string
}

export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`rounded-2xl p-6 border transition-colors duration-200 ${
        hovered ? 'bg-white/[0.05] border-indigo-500/30' : 'bg-white/[0.03] border-white/[0.07]'
      }`}
    >
      <div className="text-[28px] mb-3">{icon}</div>
      <h3 className="text-[15px] font-semibold text-[#f0f0f8] mb-2">{title}</h3>
      <p className="text-[13px] text-[color:var(--t2)] leading-relaxed">{desc}</p>
    </div>
  )
}
