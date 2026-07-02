import CustomerForm from '@/components/CustomerForm'
export default function NewCustomerPage() {
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{color:'var(--t1)'}}>Add Customer</h1>
        <p className="text-sm mt-0.5" style={{color:'var(--t3)'}}>Individual or company client</p>
      </div>
      <CustomerForm/>
    </div>
  )
}
