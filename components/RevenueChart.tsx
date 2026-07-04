import { currencySymbol } from '@/lib/types'

interface Invoice {
  status: string
  issue_date: string
  total: number
}

function getMonthlyRevenue(invoices: Invoice[]) {
  const months: { key: string; label: string; revenue: number }[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('en-GB', { month: 'short' }), revenue: 0 })
  }
  const map = new Map(months.map(m => [m.key, m]))
  invoices.filter(i => i.status === 'paid').forEach(inv => {
    const d = new Date(inv.issue_date)
    const bucket = map.get(`${d.getFullYear()}-${d.getMonth()}`)
    if (bucket) bucket.revenue += inv.total || 0
  })
  return months
}

export default function RevenueChart({ invoices, currency = 'GBP' }: { invoices: Invoice[]; currency?: string }) {
  const sym = currencySymbol(currency)
  const months = getMonthlyRevenue(invoices)
  const max = Math.max(...months.map(m => m.revenue), 1)
  const total = months.reduce((s, m) => s + m.revenue, 0)

  const chartH = 110
  const barW = 32
  const gap = 28
  const width = months.length * (barW + gap) - gap + 20

  return (
    <div className="rounded-xl border p-5 mb-4" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--t1)' }}>Revenue</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--t3)' }}>Last 6 months</p>
        </div>
        <p className="text-lg font-bold font-display" style={{ color: 'var(--t1)' }}>{sym}{total.toFixed(2)}</p>
      </div>
      <svg viewBox={`0 0 ${width} ${chartH + 24}`} style={{ width: '100%', height: 150 }} preserveAspectRatio="xMidYMid meet">
        {months.map((m, i) => {
          const h = max > 0 ? Math.max((m.revenue / max) * chartH, 2) : 2
          const x = i * (barW + gap) + 10
          const y = chartH - h
          const isCurrent = i === months.length - 1
          return (
            <g key={m.key}>
              <title>{m.label}: {sym}{m.revenue.toFixed(2)}</title>
              <rect x={x} y={y} width={barW} height={h} rx={4}
                style={{ fill: isCurrent ? 'var(--accent)' : 'var(--bg4)' }} />
              <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" fontSize="10" style={{ fill: 'var(--t3)' }}>{m.label}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
