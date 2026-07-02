export interface BusinessSettings {
  id: string; user_id: string; type: 'company' | 'freelancer'
  name: string; email: string | null; phone: string | null; website: string | null
  address: string | null; city: string | null; postcode: string | null; country: string | null
  company_reg: string | null; vat_number: string | null; logo_url: string | null
  signature_url: string | null; payment_terms: string | null; bank_details: string | null
  currency: string; invoice_color: string
}
export interface Customer {
  id: string; user_id: string; type: 'individual' | 'company'
  name: string; company_name: string | null; company_reg: string | null
  vat_number: string | null; contact_name: string | null; phone: string | null
  email: string | null; address: string | null; city: string | null
  postcode: string | null; country: string | null; notes: string | null; created_at: string
}
export interface Invoice {
  id: string; user_id: string; customer_id: string
  type: 'invoice' | 'quotation'; invoice_number: string
  status: 'draft' | 'sent' | 'paid' | 'accepted' | 'declined' | 'overdue' | 'partially_paid'
  issue_date: string; due_date: string | null; notes: string | null
  subtotal: number; vat_rate: number; vat_amount: number; total: number
  amount_paid: number; payment_terms: string | null; converted_to_invoice: string | null
  currency: string; created_at: string; customer?: Customer; items?: InvoiceItem[]
}
export interface InvoiceItem {
  id: string; invoice_id: string; description: string
  quantity: number; unit_price: number; vat_rate: number; total: number
}
export const CURRENCIES: Record<string, { symbol: string; name: string }> = {
  GBP: { symbol: '£', name: 'British Pound' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  CAD: { symbol: 'CA$', name: 'Canadian Dollar' },
  AED: { symbol: 'AED', name: 'UAE Dirham' },
  OMR: { symbol: 'OMR', name: 'Omani Rial' },
}
export function currencySymbol(code: string): string {
  return CURRENCIES[code]?.symbol || code
}
export const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  paid:           { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Paid' },
  sent:           { bg: 'bg-blue-50',    text: 'text-blue-700',    label: 'Sent' },
  draft:          { bg: 'bg-gray-100',   text: 'text-gray-500',    label: 'Draft' },
  overdue:        { bg: 'bg-red-50',     text: 'text-red-600',     label: 'Overdue' },
  partially_paid: { bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Partial' },
  accepted:       { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Accepted' },
  declined:       { bg: 'bg-red-50',     text: 'text-red-600',     label: 'Declined' },
}
export function computeStatus(inv: { status: string; due_date: string | null; amount_paid?: number; total: number }): string {
  if (inv.status === 'paid') return 'paid'
  if ((inv.amount_paid || 0) > 0 && (inv.amount_paid || 0) < inv.total) return 'partially_paid'
  if (inv.due_date && new Date(inv.due_date) < new Date() && inv.status === 'sent') return 'overdue'
  return inv.status
}
