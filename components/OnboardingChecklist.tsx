import Link from 'next/link'
import { Check, Building2, UserPlus, FileText } from 'lucide-react'

interface Props {
  bizDone: boolean
  customerDone: boolean
  invoiceDone: boolean
}

export default function OnboardingChecklist({ bizDone, customerDone, invoiceDone }: Props) {
  if (bizDone && customerDone && invoiceDone) return null

  const steps = [
    {
      done: bizDone,
      icon: Building2,
      title: 'Add your business details',
      desc: 'Add your name or company name, address, logo and signature so they appear on every invoice you send.',
      cta: 'Complete your details',
      href: '/dashboard/settings',
    },
    {
      done: customerDone,
      icon: UserPlus,
      title: 'Add your first customer',
      desc: 'Save the contact details of the person or company you want to invoice.',
      cta: 'Add a customer',
      href: '/dashboard/customers/new',
    },
    {
      done: invoiceDone,
      icon: FileText,
      title: 'Create your first invoice',
      desc: 'Now that your details and customer are ready, you can create and send your first invoice.',
      cta: 'Create an invoice',
      href: '/dashboard/invoices/new',
    },
  ]

  return (
    <div className="rounded-xl border overflow-hidden mb-6" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="text-sm font-semibold" style={{ color: 'var(--t1)' }}>Let&apos;s get your account ready</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--t3)' }}>A few quick steps before you send your first invoice</p>
      </div>
      <div>
        {steps.map((step, i) => (
          <div key={step.title} className="flex items-center justify-between gap-4 px-5 py-4"
            style={{ borderBottom: i < steps.length - 1 ? '1px solid var(--border2)' : 'none' }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: step.done ? 'rgba(52,211,153,0.12)' : 'var(--accent-s)' }}>
                {step.done
                  ? <Check size={15} style={{ color: 'var(--ok)' }} />
                  : <step.icon size={14} style={{ color: 'var(--accent)' }} />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--t1)' }}>{step.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--t3)' }}>{step.desc}</p>
              </div>
            </div>
            {!step.done && (
              <Link href={step.href}
                className="text-xs font-semibold px-3 py-2 rounded-lg text-white flex-shrink-0 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                {step.cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
