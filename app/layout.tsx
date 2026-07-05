import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Sypho CRM — Invoicing for Trade and Service Businesses',
  description: 'Professional CRM and invoicing for trade and service businesses. Create invoices, track payments, manage customers.',
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='10' cy='16' r='10' fill='%236366f1'/><text x='18' y='22' font-family='sans-serif' font-weight='700' font-size='14' fill='%23fff'>s</text></svg>" }
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
